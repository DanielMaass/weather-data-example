import { createColumnHelper } from "@tanstack/react-table"
import { TemperatureDataRow } from "../../lib/temperature-data-types"

const columnHelper = createColumnHelper<TemperatureDataRow>()

export const temperatureColumns = [
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
  columnHelper.accessor("low", {
    header: "Tiefstwerte (°C)",
    meta: { align: "right" },
  }),
  columnHelper.accessor("high", {
    header: "Höchstwerte (°C)",
    meta: { align: "right" },
  }),
]
