// Utility to load Magdeburg weather data.
// - Server (Node): try to read JSON file first, fall back to parsing the original TXT

export async function loadMagdeburgData(): Promise<any> {
  // Server-side: read files directly
  if (typeof window === "undefined") {
    const fs = await import("fs")

    // Try JSON first
    try {
      const jsonUrl = new URL("../../data/produkt_klima_tag_20240517_20251117_03126.json", import.meta.url)
      const content = await fs.promises.readFile(jsonUrl, "utf8")
      return JSON.parse(content)
    } catch (err: any) {
      // If JSON is missing, fallback to TXT parsing
      if (err && err.code === "ENOENT") {
        const txtUrl = new URL("../../data/produkt_klima_tag_20240517_20251117_03126.txt", import.meta.url)
        const raw = await fs.promises.readFile(txtUrl, "utf8")

        const parseLine = (line: string) => {
          const cols: string[] = []
          let cur = ""
          let inQuotes = false
          for (let i = 0; i < line.length; i++) {
            const ch = line[i]
            if (ch === '"') {
              inQuotes = !inQuotes
              continue
            }
            if (ch === ";" && !inQuotes) {
              cols.push(cur.trim())
              cur = ""
              continue
            }
            cur += ch
          }
          cols.push(cur.trim())
          return cols
        }

        const convertValue = (v: string) => {
          if (v === "" || v == null) return null
          const cleaned = v.replace(/\s+/g, "")
          if (/^-?\d+$/.test(cleaned)) return Number(cleaned)
          if (/^-?\d+[.,]\d+$/.test(cleaned)) return Number(cleaned.replace(",", "."))
          return v
        }

        const lines = raw
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean)
        if (lines.length === 0) return []
        const headers = parseLine(lines[0]).map((h) => h.replace(/\s+/g, ""))
        if (headers[headers.length - 1]?.toLowerCase() === "eor") headers.pop()
        const rows: Record<string, any>[] = []
        for (let i = 1; i < lines.length; i++) {
          const parts = parseLine(lines[i])
          if (parts.length > 0 && parts[parts.length - 1]?.toLowerCase() === "eor") parts.pop()
          if (parts.length < headers.length) continue
          const obj: Record<string, any> = {}
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = convertValue(parts[j] ?? "")
          }
          rows.push(obj)
        }
        return rows
      }

      // Unexpected server error
      throw err
    }
  }
}

export default loadMagdeburgData
