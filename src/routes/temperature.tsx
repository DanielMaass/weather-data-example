import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Area, AreaChart, Bar, BarChart, Brush, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import { magdeburgDataQuery } from "../lib/magdeburgData.query"

export const Route = createFileRoute("/temperature")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useQuery(magdeburgDataQuery)
  const chartData = data?.map(({ MESS_DATUM, TNK, TXK }: { MESS_DATUM: number | string; TNK: number; TXK: number }) => {
    const s = String(MESS_DATUM).padStart(8, "0") // ensure YYYYMMDD length
    const year = s.slice(0, 4)
    const month = s.slice(4, 6)
    const day = s.slice(6, 8)
    const date = `${day}.${month}.${year}`

    return {
      date,
      low: TNK,
      high: TXK,
      lowhigh: [TNK, TXK],
    }
  })

  const chartConfig = {
    low: {
      label: "Tiefstwerte",
      color: "#2563eb",
    },
    high: {
      label: "Höchstwerte",
      color: "#60a5fa",
    },
  } satisfies ChartConfig

  return (
    <div>
      <div className="flex justify-between items-center gap-2">
        <p className="text-temperature">Temperaturen in °C</p>
        <div className="text-temperature">Zeitraum</div>
      </div>
      {/* Main chart: shows only the currently selected window from the overview brush.
          Instead of changing the chart's pixel width when zooming, we keep the chart
          width constant and change barSize (and gaps) to create a zoom effect. */}
      <ChartContainer config={chartConfig} className="w-full">
        {/* Let Recharts compute bar sizing based on available width and number of points.
              This produces the desired zoom: fewer points -> wider bars, without us measuring. */}
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="lowhigh" fill="#AAA5FA" />
          <Brush dataKey="date" />
        </BarChart>
      </ChartContainer>
      {/* Recharts Brush is used inside the main BarChart (see <Brush />) to control windowRange. */}
      Temperatur details
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
