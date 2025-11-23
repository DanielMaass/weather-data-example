import type { SortingState } from '@tanstack/react-table';
import type { PrecipitationDataRow, TemperatureDataRow } from '../types';

type DataRow = TemperatureDataRow | PrecipitationDataRow;

export function sortByTableSort(data: DataRow[], sorting: SortingState): DataRow[] {
  if (!sorting.length) return data

  return data.toSorted((a: DataRow, b: DataRow) => {
    for (const { id, desc } of sorting) {
      const va = a[id as keyof DataRow]
      const vb = b[id as keyof DataRow]
      if (va == null && vb == null) continue
      if (va == null) return desc ? 1 : -1
      if (vb == null) return desc ? -1 : 1
      if (va instanceof Date && vb instanceof Date) {
        const diff = va.getTime() - vb.getTime()
        if (diff !== 0) return desc ? -diff : diff
        continue
      }
      if (typeof va === 'number' && typeof vb === 'number') {
        const diff = va - vb
        if (diff !== 0) return desc ? -diff : diff
        continue
      }
      const sva = String(va)
      const svb = String(vb)
      if (sva === svb) continue
      return (sva < svb ? -1 : 1) * (desc ? -1 : 1)
    }
    return 0
  })
}
