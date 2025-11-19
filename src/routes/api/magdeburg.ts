import { createFileRoute, FileRoutesByPath } from "@tanstack/react-router"

export const Route = createFileRoute("/api/magdeburg" as unknown as keyof FileRoutesByPath)({
  server: {
    handlers: {
      GET: async () => {
        try {
          const mod = await import("../../lib/loadMagdeburgData")
          const data = await mod.loadMagdeburgData()
          return new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } })
        } catch (err: any) {
          const msg = `Could not load magdeburg data: ${err?.message ?? err}`
          return new Response(JSON.stringify({ error: msg }), {
            status: 500,
            headers: { "content-type": "application/json" },
          })
        }
      },
    },
  },
})
