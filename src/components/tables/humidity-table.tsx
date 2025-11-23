import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  Table,
  useReactTable
} from "@tanstack/react-table"
import { useVirtualizer, VirtualItem, Virtualizer } from "@tanstack/react-virtual"
import { ArrowDown, ArrowUp } from "lucide-react"
import { RefObject, useEffect, useRef } from "react"
import { useHumidity } from '../../context/humidity-context'
import { cn } from "../../lib/utils"
import type { HumidityDataRow } from '../../types'
import { humidityColumns } from './humidity-columns'

export const HumidityTable = () => {
  const { data, sorting, setSorting } = useHumidity()
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const table = useReactTable({
    columns: humidityColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <div
      className="custom-scrollbar bg-black/5 border-l border-black/10 w-fit shrink-0"
      ref={tableContainerRef}
      style={{
        overflow: "auto", //our scrollable table container
        position: "relative", //needed for sticky header
        height: "100vh", //should be a fixed height
      }}
    >
      <div role="table" style={{ display: "grid" }}>
        <div
          role="rowgroup"
          className="bg-background/30 backdrop-blur-xs"
          style={{
            display: "grid",
            position: "sticky",
            top: 0,
            zIndex: 1,
            paddingInline: "1rem",
            paddingBlock: "0.5rem",
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <div key={headerGroup.id} role="row" style={{ display: "flex" }}>
              {headerGroup.headers.map((header) => {
                const align = (header.column.columnDef.meta as any)?.align ?? "left"
                return (
                  <div
                    role="columnheader"
                    key={header.id}
                    style={{
                      display: "flex",
                      width: header.getSize(),
                      justifyContent: align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start",
                    }}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-0.5 whitespace-nowrap font-normal",
                        header.column.getCanSort() && "cursor-pointer select-none",
                        header.column.getIsSorted() && "text-humidity"
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ justifyContent: align === "right" ? "flex-end" : undefined }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} className={cn(header.column.getIsSorted() || "opacity-0")} />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <VirtualizedTableBody table={table} scrollContainerRef={tableContainerRef} />
      </div>
    </div>
  )
}

// A small, local component that renders a virtualized table body for a TanStack table.
function VirtualizedTableBody({
  table,
  scrollContainerRef,
}: {
  table: Table<HumidityDataRow>
  scrollContainerRef: RefObject<HTMLDivElement | null>
}) {
  const { rows } = table.getRowModel()
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLElement>({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => scrollContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()

  // Try to initialize the virtualizer after mount / when rows change.
  useEffect(() => {
    if (rows.length === 0) return

    const el = scrollContainerRef.current
    if (!el) return

    // WORKAROUND for reloading issue
    // React 19 compiler and TanStack Virtualizer sometimes don't play well together.
    // schedule a frame so layout is settled, then nudge the virtualizer to measure
    const id = requestAnimationFrame(() => {
      try {
        // Some versions expose measure() or forceUpdate internals — call if present
        ;(rowVirtualizer as any).measure?.()
      } catch (e) {
        // ignore
      }

      try {
        // access getVirtualItems to force computation
        rowVirtualizer.getVirtualItems()
      } catch (e) {
        // ignore
      }

      try {
        ;(rowVirtualizer as any).scrollToOffset?.(0)
      } catch (e) {
        // ignore
      }
    })
    // WORKAROUND end

    return () => cancelAnimationFrame(id)
  }, [rows.length, rowVirtualizer, scrollContainerRef])

  return (
    <div
      role="rowgroup"
      style={{
        display: "grid",
        height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
        position: "relative", //needed for absolute positioning of rows
      }}
    >
      {virtualItems.map((virtualRow) => {
        const row = rows[virtualRow.index] as Row<HumidityDataRow>
        return <TableBodyRow key={row.id} row={row} virtualRow={virtualRow} rowVirtualizer={rowVirtualizer} />
      })}
    </div>
  )
}

function TableBodyRow({
  row,
  virtualRow,
  rowVirtualizer,
}: {
  row: Row<HumidityDataRow>
  virtualRow: VirtualItem
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>
}) {
  return (
    <div
      role="row"
      data-index={virtualRow.index} //needed for dynamic row height measurement
      ref={(node) => rowVirtualizer.measureElement(node as HTMLElement)} //measure dynamic row height
      key={row.id}
      style={{
        display: "flex",
        position: "absolute",
        transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
        paddingInline: "1rem",
      }}
    >
      {row.getVisibleCells().map((cell) => {
        const align = (cell.column.columnDef.meta as any)?.align ?? "left"
        return (
          <div
            role="cell"
            key={cell.id}
            style={{
              display: "flex",
              width: cell.column.getSize(),
              justifyContent: align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start",
              textAlign: align === "right" ? "right" : align === "center" ? "center" : "left",
              paddingRight: align === "right" ? "1.25rem" : undefined,
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        )
      })}
    </div>
  )
}
