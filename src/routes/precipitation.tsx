import { createFileRoute } from "@tanstack/react-router"
import { PrecipitationChart } from '../components/charts/precipitation-chart'
import { Header } from "../components/Header"
import { MainNav } from "../components/MainNav"
import { Search } from '../components/Search'
import { PrecipitationTable } from '../components/tables/precipitation-table'
import { TimeRangeSwitch } from '../components/TimeRangeSwitch'
import { PrecipitationProvider, usePrecipitation } from '../context/precipitation-context'

export const Route = createFileRoute("/precipitation")({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <PrecipitationProvider>
      <div className="grid grid-cols-[1fr_auto]">
        <div className="py-8 px-20 space-y-6 min-w-0">
          <div className="flex justify-between items-end gap-4">
            <Header />
            <Search useContextHook={usePrecipitation} color="precipitation"/>
          </div>
          <div className="flex justify-between items-end gap-2">
            <MainNav />
            <TimeRangeSwitch useContextHook={usePrecipitation} color="precipitation" />
          </div>
          <PrecipitationChart />
        </div>
        <PrecipitationTable />
      </div>
    </PrecipitationProvider>
  )
}
