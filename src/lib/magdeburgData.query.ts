import loadMagdeburgData from "./loadMagdeburgData"

export const magdeburgDataQuery = {
  queryKey: ["magdeburg"],
  queryFn: loadMagdeburgData,
  staleTime: Infinity,
  suspense: true,
  useErrorBoundary: true,
}
