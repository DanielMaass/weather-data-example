import loadMagdeburgData from "./loadMagdeburgData"
import type { WeatherData } from "./weather-data-types"

export const magdeburgDataQuery = {
  queryKey: ["magdeburg"] as const,
  queryFn: loadMagdeburgData as () => Promise<WeatherData>,
  staleTime: Infinity,
  suspense: true,
  useErrorBoundary: true,
}
