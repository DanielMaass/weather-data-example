import { createColumnHelper } from "@tanstack/react-table"
import type { PrecipitationDataRow } from '../../types'


const columnHelper = createColumnHelper<PrecipitationDataRow>()

export const precipitationColumns = [
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
    header: "Niederschlag (mm)",
    meta: { align: "right" },
  }),
]
