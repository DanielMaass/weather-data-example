import { TemperatureDataRow } from '../types'

export function addMaxMinTempValues(data: TemperatureDataRow[]) {
  if (!data.length) return { data: [], maxTemp: null, minTemp: null }

  const highs = data.filter(d => d.high != null).map(d => d.high as number)
  const lows = data.filter(d => d.low != null).map(d => d.low as number)
  const maxTemp = highs.length ? Math.max(...highs) : null
  const minTemp = lows.length ? Math.min(...lows) : null

  const newData = data.map((row) => {
    const isMax = maxTemp != null && row.high === maxTemp
    const isMin = minTemp != null && row.low === minTemp

    if (isMax && isMin) {
      return { ...row, maxTemp, minTemp }
    } else if (isMax) {
      return { ...row, maxTemp }
    } else if (isMin) {
      return { ...row, minTemp }
    }

    return row
  })

  return { data: newData, maxTemp, minTemp }
}
