import { createColumnHelper } from "@tanstack/react-table"
import type { HumidityDataRow } from '../../types'


const columnHelper = createColumnHelper<HumidityDataRow>()

export const humidityColumns = [
  columnHelper.accessor("date", {
    header: "Datum",
    cell: ({ getValue }) =>
      getValue().toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      sortingFn: 'datetime',
  }),
  columnHelper.accessor("value", {
    header: "rel. Luftfeuchtigkeit (%)",
    meta: { align: "right" },
  }),
]
