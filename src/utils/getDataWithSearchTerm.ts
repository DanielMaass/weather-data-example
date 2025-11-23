import { HumidityDataRow, PrecipitationDataRow, TemperatureDataRow } from '../types';
import { parseDateSearch } from './parseDateSearch';
import { parseNumericSearch } from './parseNumericSearch';

type DataRow = TemperatureDataRow | PrecipitationDataRow | HumidityDataRow;

export function getDataWithSearchTerm(data: DataRow[], searchTerm: string): DataRow[] {
  if (!data.length) return []

  const term = searchTerm.trim()
  if (!term) return data

  const numericSearch = parseNumericSearch(term)
  const dateSearch = parseDateSearch(term)

  const searchedData = new Set<DataRow[]>()

  if (numericSearch != null) {
    searchedData.add(data.filter((d) => {
      if ('low' in d && d.low === numericSearch) return true
      if ('high' in d && d.high === numericSearch) return true
      if ('value' in d && d.value === numericSearch) return true
      return false
    }))
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
