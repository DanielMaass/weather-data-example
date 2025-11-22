import { PrecipitationDataRow } from '../types'

export function addMaxValues(data: PrecipitationDataRow[]) {
  if (!data.length) return { data: [], max: null }

  const values = data.filter(d => d.value != null).map(d => d.value as number)
  const max = values.length ? Math.max(...values) : null

  const newData = data.map((row) => {
    const isMax = max != null && row.value === max

    if (isMax) {
      return { ...row, max }
    }

    return row
  })

  return { data: newData, max }
}
