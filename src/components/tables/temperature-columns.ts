import { createColumnHelper } from "@tanstack/react-table"
import React from 'react'
import type { TemperatureDataRow } from '../../types'

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
    header: () => <span data-testid="temperature-high-header">Höchstwerte (°C)</span>,
    meta: { align: "right" },
  }),
]
