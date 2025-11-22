import { TemperatureDataRow } from '../lib/temperature-data-types'
import { parseDateSearch } from './parseDateSearch'
import { parseNumericSearch } from './parseNumericSearch'

export function getDataWithSearchTerm(data: TemperatureDataRow[], searchTerm: string): TemperatureDataRow[] {
  if(!data.length) return []

  const term = searchTerm.trim()
  if (!term) return data

  const numericSearch = parseNumericSearch(term)
  const dateSearch = parseDateSearch(term)
  const searchedData = new Set<TemperatureDataRow[]>()

  if (numericSearch != null) {
    searchedData.add(data.filter((d) => d.low === numericSearch || d.high === numericSearch))
  }

  if (dateSearch) {
    searchedData.add(data.filter((d) => {
      const dd = d.date.getDate()
      const mm = d.date.getMonth()
      const yyyy = d.date.getFullYear()
      if (dateSearch.year != null) {
        return dd === dateSearch.day && mm === dateSearch.month && yyyy === dateSearch.year
      }
      return dd === dateSearch.day && mm === dateSearch.month
    }))
  }

  return searchedData.size ? Array.from(searchedData).flat() : data
}
