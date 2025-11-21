import { TanStackDevtools } from "@tanstack/react-devtools"
import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import React, { Suspense } from "react"

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools"

import appCss from "../styles.css?url"

import type { QueryClient } from "@tanstack/react-query"
import ErrorBoundary from "../components/ErrorBoundary"
import { magdeburgDataQuery } from "../lib/magdeburgData.query"

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  // Prefetch Magdeburg data into the React Query cache so child routes can use useQuery
  loader: async ({ context }) => {
    try {
      // Prefetch into the provided queryClient from the router context
      await context.queryClient.prefetchQuery(magdeburgDataQuery)
      return null
    } catch (err: any) {
      // Keep compatibility with previous behavior: return an error object instead of throwing
      return { __loaderError: String(err?.message ?? err) }
    }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Wetterdaten Magdeburg",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ErrorBoundary>
          <Suspense fallback={<div className="p-8">Lade Daten…</div>}>{children}</Suspense>
        </ErrorBoundary>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
