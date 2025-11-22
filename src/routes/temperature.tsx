import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { SortingState } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { TemperatureChart } from "../components/charts/temperature-chart"
import { Header } from "../components/Header"
import { MainNav } from "../components/MainNav"
import { TemperatureTable } from "../components/tables/temperature-table"
import { Button } from "../components/ui/button"
import { ButtonGroup } from "../components/ui/button-group"
import { magdeburgDataQuery } from "../lib/magdeburgData.query"
import { cn } from '../lib/utils'
import { WeatherDataRow } from "../lib/weather-data-types"

export const Route = createFileRoute("/temperature")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useQuery(magdeburgDataQuery)
  const [sorting, setSorting] = useState<SortingState>([])
  const [timeRange, setTimeRange] = useState<"1M" | "6M" | "1J" | "Max">("Max")

  const temperatureData = useMemo(
    () => {
      if(!data) return []
      const convertedData = data.map(({ MESS_DATUM, TNK, TXK }: Pick<WeatherDataRow, "MESS_DATUM" | "TNK" | "TXK">) => {
        const year = MESS_DATUM.toString().slice(0, 4)
        const month = MESS_DATUM.toString().slice(4, 6)
        const day = MESS_DATUM.toString().slice(6, 8)
        const date = new Date(Number(year), Number(month) - 1, Number(day))
        const lowhigh: [number, number] | undefined = TNK && TXK ? [TNK, TXK] : undefined

        return {
          date,
          low: TNK,
          high: TXK,
          lowhigh,
        }
      }).sort((a, b) => a.date.getTime() - b.date.getTime())

      const lastDate = convertedData?.[convertedData.length - 1]?.date
      let firstDate = convertedData?.[0]?.date
      if(timeRange === "1M") {
        firstDate = new Date(lastDate!.getFullYear(), lastDate!.getMonth() -1, lastDate!.getDate())
      } else if(timeRange === "6M") {
        firstDate = new Date(lastDate!.getFullYear(), lastDate!.getMonth() -6, lastDate!.getDate())
      } else if(timeRange === "1J") {
        firstDate = new Date(lastDate!.getFullYear() -1, lastDate!.getMonth(), lastDate!.getDate())
      }

      const filtered = convertedData.filter(d => d.date >= firstDate!)
      const max = Math.max(...(filtered.length ? filtered.map((d) => d.high ?? Number.NEGATIVE_INFINITY) : [Number.NEGATIVE_INFINITY]))
      const min = Math.min(...(filtered.length ? filtered.map((d) => d.low ?? Number.POSITIVE_INFINITY) : [Number.POSITIVE_INFINITY]))

      let base = filtered.map((i) => {
        if (i.high === max) {
          return { ...i, max: i.high }
        }
        if (i.low === min) {
          return { ...i, min: i.low }
        }
        return i
      })

      // Apply external sorting based on current sorting state (multi-sort support)
      if (sorting.length) {
        const compare = (a: any, b: any) => {
          for (const { id, desc } of sorting) {
            const va = a[id]
            const vb = b[id]
            if (va == null && vb == null) continue
            if (va == null) return desc ? 1 : -1
            if (vb == null) return desc ? -1 : 1
            // Date comparison
            if (va instanceof Date && vb instanceof Date) {
              const diff = va.getTime() - vb.getTime()
              if (diff !== 0) return desc ? -diff : diff
              continue
            }
            // Numeric comparison
            if (typeof va === 'number' && typeof vb === 'number') {
              const diff = va - vb
              if (diff !== 0) return desc ? -diff : diff
              continue
            }
            // Fallback string comparison
            const sva = String(va)
            const svb = String(vb)
            if (sva === svb) continue
            return (sva < svb ? -1 : 1) * (desc ? -1 : 1)
          }
          return 0
        }
        base = [...base].sort(compare)
      }

      return base
    },
    [data, timeRange, sorting]
  )

  const from = useMemo(
    () => {
      if(temperatureData.length === 0) return null
      const sortedByDate = [...temperatureData].sort((a, b) => a.date.getTime() - b.date.getTime())
      return sortedByDate[0].date
    },
    [temperatureData]
  )
  const to = useMemo(
    () => {
      if(temperatureData.length === 0) return null
      const sortedByDate = [...temperatureData].sort((a, b) => b.date.getTime() - a.date.getTime())
      return sortedByDate[0].date
    },
    [temperatureData]
  )

  return (
    <div className="flex">
      <div className="grow py-8 px-20 space-y-6 max-w-4xl mx-auto">
        <Header />

        <div className="flex justify-between items-end gap-2">
          <MainNav />
          <ButtonGroup aria-label="Zeitraum auswählen">
            <Button variant="ghost" size="sm" className={cn(timeRange === "1M" && "text-temperature bg-muted-foreground pointer-events-none")} onClick={() => setTimeRange("1M")}>
              1M
            </Button>
            <Button variant="ghost" size="sm" className={cn(timeRange === "6M" && "text-temperature bg-muted-foreground pointer-events-none")} onClick={() => setTimeRange("6M")}>
              6M
            </Button>
            <Button variant="ghost" size="sm" className={cn(timeRange === "1J" && "text-temperature bg-muted-foreground pointer-events-none")} onClick={() => setTimeRange("1J")}>
              1J
            </Button>
            <Button variant="ghost" size="sm" className={cn(timeRange === "Max" && "text-temperature bg-muted-foreground pointer-events-none")} onClick={() => setTimeRange("Max")}>
              Max
            </Button>
          </ButtonGroup>
        </div>
        <div className='flex justify-between'>
        <p className="text-xs">Temperaturen in °C</p>
        <p className="text-xs">Zeitraum von {from?.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" })} bis {to?.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" })}</p>
        </div>
        <TemperatureChart data={temperatureData} />
      </div>
      <TemperatureTable data={temperatureData} sorting={sorting} setSorting={setSorting} />
    </div>
  )
}
