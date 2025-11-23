import { createFileRoute } from "@tanstack/react-router"
import { TemperatureChart } from "../components/charts/temperature-chart"
import { Header } from "../components/Header"
import { MainNav } from "../components/MainNav"
import { Search } from '../components/Search'
import { TemperatureTable } from "../components/tables/temperature-table"
import { TimeRangeSwitch } from '../components/TimeRangeSwitch'
import { TemperatureProvider, useTemperature } from '../context/temperature-context'

export const Route = createFileRoute("/temperature")({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <TemperatureProvider>
      <div className="grid grid-cols-[1fr_auto]">
        <div className="py-8 px-20 space-y-6 min-w-0">
          <div className="flex justify-between items-end gap-4">
            <Header />
            <Search useContextHook={useTemperature} color="temperature" />
          </div>
          <div className="flex justify-between items-end gap-2">
            <MainNav />
            <TimeRangeSwitch useContextHook={useTemperature} color="temperature" />
          </div>
          <TemperatureChart />
        </div>
        <TemperatureTable />
      </div>
    </TemperatureProvider>
  )
}
