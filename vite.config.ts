import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import viteTsConfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

const isTest = !!process.env.VITEST

const config = defineConfig({
  plugins: [
    // Exclude heavy dev plugins under Vitest to avoid hanging processes
    !isTest && devtools(),
    !isTest && nitro(),
    // Skip tanstackStart during tests to reduce transform complexity
    !isTest && tanstackStart(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    // Use simpler React plugin variant during tests (no experimental compiler)
    isTest
      ? viteReact()
      : viteReact({
          babel: {
            plugins: ["babel-plugin-react-compiler"],
          },
        }),
  ].filter(Boolean),
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    globals: true,
    coverage: {
      reporter: ["text", "html"],
    },
    reporters: process.env.CI ? ["default", "hanging-process"] : ["default"],
  },
})

export default config
