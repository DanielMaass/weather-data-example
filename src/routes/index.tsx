import { createFileRoute, redirect } from "@tanstack/react-router"
import { Route as TemperatureRoute } from "./temperature"

// Redirect root to /temperature (works server- and client-side)
export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    throw redirect({ to: TemperatureRoute.to })
  },
})
