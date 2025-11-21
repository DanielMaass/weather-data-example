import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Header } from "../components/Header"
import { MainNav } from "../components/MainNav"
import { Button } from "../components/ui/button"
import { ButtonGroup } from "../components/ui/button-group"
import { magdeburgDataQuery } from "../lib/magdeburgData.query"

export const Route = createFileRoute("/humidity")({
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
        <p className="text-xs">Luftfeuchtigkeit %</p>
      </div>
      Humidity details
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
