import { PrecipitationDataRow, TemperatureDataRow } from '../types'

export function getDataInTimeRange(data: (TemperatureDataRow | PrecipitationDataRow)[], timeRange: '1M' | '6M' | '1J' | 'Max'): (TemperatureDataRow | PrecipitationDataRow)[] {
  if(!data.length) return []

  const lastDate = data[data.length - 1].date
  let firstDate = data[0].date

  if (lastDate) {
    if (timeRange === '1M') {
      firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth() - 1, lastDate.getDate())
    } else if (timeRange === '6M') {
      firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth() - 6, lastDate.getDate())
    } else if (timeRange === '1J') {
      firstDate = new Date(lastDate.getFullYear() - 1, lastDate.getMonth(), lastDate.getDate())
    }
  }

  return data.filter((d) => (firstDate ? d.date >= firstDate : true))
}
