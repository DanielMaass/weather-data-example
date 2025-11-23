import type { HumidityDataRow, PrecipitationDataRow, TemperatureDataRow } from '../types'
import { parseDateSearch } from './parseDateSearch'
import { parseNumericSearch } from './parseNumericSearch'

type DataRow = TemperatureDataRow | PrecipitationDataRow | HumidityDataRow

function collectNumericValues(d: DataRow): number[] {
  const vals: number[] = []
  if ('low' in d && typeof d.low === 'number') vals.push(d.low)
  if ('high' in d && typeof d.high === 'number') vals.push(d.high)
  if ('value' in d && typeof d.value === 'number') vals.push(d.value)
  return vals
}

export function getDataWithSearchTerm(data: DataRow[], searchTerm: string): DataRow[] {
  if (!data.length) return []

  const term = searchTerm.trim()
  if (!term) return data

  const results = new Set<DataRow>()

  // Compute both numeric and date parses up-front; we'll aggregate matches from both.
  const numeric = parseNumericSearch(term)
  const dateSearch = parseDateSearch(term)

  // Date-based matching (if any)
  if (dateSearch) {
    if (dateSearch.month != null && dateSearch.day == null) {
      for (const row of data) {
        const mm = row.date.getMonth()
        const yy = row.date.getFullYear()
        if (dateSearch.year != null) {
          if (mm === dateSearch.month && yy === dateSearch.year) results.add(row)
        } else {
          if (mm === dateSearch.month) results.add(row)
        }
      }
    } else if (dateSearch.month != null && dateSearch.day != null) {
      // Exact day+month (numeric) -> match those dates across years or within a specific year
      for (const row of data) {
        const dd = row.date.getDate()
        const mm = row.date.getMonth()
        const yy = row.date.getFullYear()
        if (dd !== dateSearch.day) continue
        if (mm !== dateSearch.month) continue
        if (dateSearch.year != null && yy !== dateSearch.year) continue
        results.add(row)
      }
    } else if (dateSearch.monthName != null) {
      const q = dateSearch.monthName.toLowerCase()
      for (const row of data) {
        const monthLong = row.date
          .toLocaleDateString('de-DE', { month: 'long' })
          .toLowerCase()
        const monthShort = row.date
          .toLocaleDateString('de-DE', { month: 'short' })
          .toLowerCase()
          .replace(/\./g, '')

        const monthMatches = monthLong.startsWith(q) || monthShort.startsWith(q)
        if (!monthMatches) continue

        if (dateSearch.day != null) {
          if (row.date.getDate() !== dateSearch.day) continue
        }
        if (dateSearch.year != null) {
          if (row.date.getFullYear() !== dateSearch.year) continue
        }
        results.add(row)
      }
    }
  }

  // Numeric matching (if any) — always run and merge with date results
  if (numeric != null) {
    const orig = term
    const hasDecimal = /[.,]/.test(orig)
    const normalizedNum = numeric

    for (const row of data) {
      const nums = collectNumericValues(row)

      // If exact numeric match for any numeric field
      if (nums.some((v) => v === normalizedNum)) {
        results.add(row)
        continue
      }

      if (hasDecimal) {
        // decimal search only matches exact numeric values (already checked)
        continue
      }

      // Integer search: match numeric fields whose integer part equals the number
      if (nums.some((v) => Math.trunc(Math.abs(v)) === Math.trunc(Math.abs(normalizedNum)))) {
        results.add(row)
        continue
      }

      // Also allow prefix matches: fields that start with the number (e.g. '6' matches '6.5')
      const numPrefix = String(Number(orig))
      if (nums.some((v) => String(v).startsWith(numPrefix))) {
        results.add(row)
        continue
      }

      // Date-based matches for integer search
      const dd = row.date.getDate()
      const mm = row.date.getMonth() + 1 // 1-based month
      // match day or month
      if (dd === Math.trunc(normalizedNum) || mm === Math.trunc(normalizedNum)) {
        results.add(row)
        continue
      }
    }
  }

  // If nothing matched, return empty array (per spec)
  return results.size ? Array.from(results) : []
}
