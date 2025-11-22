import { createFileRoute } from "@tanstack/react-router"
import { TemperatureChart } from "../components/charts/temperature-chart"
import { Header } from "../components/Header"
import { MainNav } from "../components/MainNav"
import { TemperatureTable } from "../components/tables/temperature-table"
import { TimeRangeSwitch } from '../components/TimeRangeSwitch'
import { TemperatureProvider } from '../context/temperature-context'
import { Search } from '../components/Search'

export const Route = createFileRoute("/temperature")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <TemperatureProvider>
      <div className="flex">
        <div className="grow py-8 px-20 space-y-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-end gap-4">
            <Header />
            <Search />
          </div>
          <div className="flex justify-between items-end gap-2">
            <MainNav />
            <TimeRangeSwitch />
          </div>
          <TemperatureChart />
        </div>
        <TemperatureTable />
      </div>
    </TemperatureProvider>
  )
}
