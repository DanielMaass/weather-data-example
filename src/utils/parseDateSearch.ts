export type DateSearch = {
  day: number
  month: number
  year?: number
}

// Parse month names (German + common abbreviations)
const monthMap: Record<string, number> = {
  jan: 0,
  januar: 0,
  feb: 1,
  februar: 1,
  mär: 2,
  maer: 2,
  mar: 2,
  märz: 2,
  maerz: 2,
  apr: 3,
  april: 3,
  mai: 4,
  jun: 5,
  juni: 5,
  jul: 6,
  juli: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  oktober: 9,
  okt: 9,
  nov: 10,
  november: 10,
  dez: 11,
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

      // Pattern textual month: 21.sep, 21.sept, 21.sep25, 21.sept2025, allow trailing dot
      const txtMatch = s.match(/^(\d{1,2})\.([a-zäöü]{3,9})\.?((\d{2}|\d{4}))?\.?$/)
      if (txtMatch) {
        const day = Number(txtMatch[1])
        const monthName = txtMatch[2]
        const yearRaw = txtMatch[3]
        const month = monthMap[monthName]
        if (month == null) return undefined
        let year: number | undefined
        if (yearRaw) {
          if (yearRaw.length === 2) year = 2000 + Number(yearRaw)
          else if (yearRaw.length === 4) year = Number(yearRaw)
        }
        if (day >= 1 && day <= 31) return { day, month, year }
        return undefined
      }
      return undefined
    }
