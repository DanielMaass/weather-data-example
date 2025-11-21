import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { magdeburgDataQuery } from "../lib/magdeburgData.query"
import { ButtonGroup } from "../components/ui/button-group"
import { Button, buttonVariants } from "../components/ui/button"
import { Header } from "../components/Header"
import { cn } from "../lib/utils"
import { BubblesIcon, CloudHailIcon, ThermometerSunIcon } from "lucide-react"
import { MainNav } from "../components/MainNav"

export const Route = createFileRoute("/precipitation")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useQuery(magdeburgDataQuery)

  return (
    <div className="p-8">
      <div className="grow py-8 px-20 space-y-6 max-w-4xl mx-auto">
        <Header />

        <div className="flex justify-between items-end gap-2">
          <MainNav />
          <ButtonGroup aria-label="Zeitraum auswählen">
            <Button variant="ghost" size="sm">
              1M
            </Button>
            <Button variant="ghost" size="sm">
              6M
            </Button>
            <Button variant="ghost" size="sm">
              1J
            </Button>
            <Button variant="ghost" size="sm">
              Max
            </Button>
          </ButtonGroup>
        </div>
        <p className="text-xs">Niederschlag in mm</p>
      </div>
      Precipitation details
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
