import { createFileRoute, redirect } from "@tanstack/react-router"
import { Route as TemperatureRoute } from "./temperature"

export const Route = createFileRoute("/$")({
  beforeLoad: () => {
    throw redirect({
      to: TemperatureRoute.to,
    })
  },
})
