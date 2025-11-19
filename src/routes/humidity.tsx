import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { magdeburgDataQuery } from "../lib/magdeburgData.query"

export const Route = createFileRoute("/humidity")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useQuery(magdeburgDataQuery)

  return (
    <div className="p-8">
      Humidity details
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
