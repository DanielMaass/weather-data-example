export type DateSearch = {
  day?: number
  month?: number
  monthName?: string
  year?: number
}

// Parse month names (German: keep canonical short and long forms + common variants)
const monthMap: Record<string, number> = {
  januar: 0,
  februar: 1,
  märz: 2,
  april: 3,
  mai: 4,
  juni: 5,
  juli: 6,
  august: 7,
  september: 8,
  oktober: 9,
  november: 10,
  dezember: 11,
}

export function parseDateSearch(raw: string): DateSearch | undefined {
      if (!raw) return undefined
      let s = raw.toLowerCase().replace(/\s+/g, '').replace(/,$/, '')
      // Replace German umlaut ae/oe/ue to unify lookups (handle maer/mär)
      s = s
        .replace(/ae/g, 'ä')
        .replace(/oe/g, 'ö')
        .replace(/ue/g, 'ü')

      // Normalize a dot directly after a month token before a year (e.g. 'sept.2025' or 'sept. 2025')
      // Remove the dot when it sits between letters and digits so 'sept.2025' -> 'sept2025'
      s = s.replace(/([a-zäöü])\.(?=\d)/g, '$1')

      // Pattern numeric month: 21.09., 21.9., 21.09, 21.09.25, 21.09.2025
      // Allow omission of third dot when year is absent (e.g. "13.03")
      const numMatch = s.match(/^(\d{1,2})\.(\d{1,2})(?:\.(\d{2,4}))?\.?$/)

      if (numMatch) {
        const day = Number(numMatch[1])
        const month = Number(numMatch[2]) - 1
        const yearRaw = numMatch[3]

        let year: number | undefined
        if (yearRaw) {
          if (yearRaw.length === 2) {
            // Assume 2000+ for two-digit year
            year = 2000 + Number(yearRaw)
          } else if (yearRaw.length === 4) {
            year = Number(yearRaw)
          }
        }
        if (day >= 1 && day <= 31 && month >= 0 && month <= 11) return { day, month, year }
        return undefined
      }

      // Pattern textual month with optional day: 21.sep, 21.sept2025, allow trailing dot
      // allow month text from 1-9 characters (prefixes or full names, after normalization to lowercase)
      const txtMatch = s.match(/^(\d{1,2})\.([a-zäöü]{1,9})\.?((\d{2}|\d{4}))?\.?$/)
      if (txtMatch) {
        const day = Number(txtMatch[1])
        const monthToken = txtMatch[2]
        const yearRaw = txtMatch[3]
        let year: number | undefined
        if (yearRaw) {
          if (yearRaw.length === 2) year = 2000 + Number(yearRaw)
          else if (yearRaw.length === 4) year = Number(yearRaw)
        }
        if (day < 1 || day > 31) return undefined

        // Try exact lookup first
        const exact = monthMap[monthToken]
        if (exact != null) return { day, month: exact, year }

        // Try prefix matching: if the token uniquely matches the start of a month key,
        // treat it as that month (e.g. 'sept' -> 'september'). If multiple months match
        // the prefix, return the token for later prefix-based matching.
        const matches = Object.entries(monthMap)
          .filter(([k]) => k.startsWith(monthToken))
          .map(([, v]) => v)

        if (matches.length === 1) return { day, month: matches[0], year }
        return { day, monthName: monthToken, year }
      }

      // Pattern month-only or month+year: "september", "sept2025", allow trailing dot
      const monthOnlyMatch = s.match(/^([a-zäöü]{1,9})(\d{2}|\d{4})?\.?$/)
      if (monthOnlyMatch) {
        const monthToken = monthOnlyMatch[1]
        const yearRaw = monthOnlyMatch[2]
        let year: number | undefined
        if (yearRaw) {
          if (yearRaw.length === 2) year = 2000 + Number(yearRaw)
          else if (yearRaw.length === 4) year = Number(yearRaw)
        }

        // Exact lookup first
        const exact = monthMap[monthToken]
        if (exact != null) return { month: exact, year }

        // Prefix matching: if unique, return numeric month; otherwise keep token
        const matches = Object.entries(monthMap)
          .filter(([k]) => k.startsWith(monthToken))
          .map(([, v]) => v)
        if (matches.length === 1) return { month: matches[0], year }
        return { monthName: monthToken, year }
      }
      return undefined
    }
