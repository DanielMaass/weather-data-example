import type { WeatherData } from "./weather-data-types"

// Adjust this constant if your JSON data file uses a different name or location
const DATA_FILE = "../../data/produkt_klima_tag_20240517_20251117_03126.json"

export async function loadMagdeburgData(): Promise<WeatherData> {
  // Server-side: read files directly
  if (typeof window === "undefined") {
    const fs = await import("fs")

    try {
      const jsonUrl = new URL(DATA_FILE, import.meta.url)
      const content = await fs.promises.readFile(jsonUrl, "utf8")
      return JSON.parse(content) as WeatherData
    } catch (err: any) {
      if (err && err.code === "ENOENT") {
        throw new Error(
          `Magdeburg data JSON file not found (tried ${DATA_FILE}). Please run the data preprocessing script "npm run convert:data" to generate it, or update the DATA_FILE constant in src/lib/loadMagdeburgData.ts to point to your JSON file.`
        )
      }

      // Unexpected server error
      throw err
    }
  }

  // Client-side fallback: return empty array (data is loaded server-side)
  return []
}

export default loadMagdeburgData
