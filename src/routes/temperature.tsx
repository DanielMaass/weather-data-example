import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Bar, BarChart } from "recharts"
import { magdeburgDataQuery } from "../lib/magdeburgData.query"

export const Route = createFileRoute("/temperature")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useQuery(magdeburgDataQuery)
  const chartData = data?.map(({ MESS_DATUM, TNK, TXK }: { MESS_DATUM: number; TNK: number; TXK: number }) => ({
    date: new Date(MESS_DATUM.toString()),
    low: TNK,
    high: TXK,
  }))
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
      <ChartContainer config={chartConfig} className="w-[3000px] overflow-x-scroll">
        <BarChart accessibilityLayer data={chartData}>
          <Bar dataKey="low" fill="#FF00FF" stackId="a" minPointSize={12} />
          <Bar dataKey="high" fill="#00FFFF" stackId="b" minPointSize={12} />
        </BarChart>
      </ChartContainer>
      Temperatur details
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
