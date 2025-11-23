import { createFileRoute } from "@tanstack/react-router"
import { Header } from "../components/Header"
import { MainNav } from "../components/MainNav"
import { Search } from '../components/Search'
import { TimeRangeSwitch } from '../components/TimeRangeSwitch'
import { HumidityChart } from '../components/charts/humidity-chart'
import { HumidityTable } from '../components/tables/humidity-table'
import { HumidityProvider, useHumidity } from '../context/humidity-context'

export const Route = createFileRoute("/humidity")({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <HumidityProvider>
          <div className="flex">
            <div className="grow py-8 px-20 space-y-6 max-w-4xl mx-auto">
              <div className="flex justify-between items-end gap-4">
                <Header />
                <Search useContextHook={useHumidity} color="humidity"/>
              </div>
              <div className="flex justify-between items-end gap-2">
                <MainNav />
                <TimeRangeSwitch useContextHook={useHumidity} color="humidity" />
              </div>
              <HumidityChart />
            </div>
            <HumidityTable />
          </div>
        </HumidityProvider>
  )
}
