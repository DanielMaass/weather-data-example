#!/usr/bin/env node
// Konvertiert eine semikolon-separierte Textdatei in JSON
// Usage: node scripts/convert-semi-to-json.js <input> <output>
import fs from "fs"
import path from "path"

const [, , inputArg, outputArg] = process.argv
const cwd = process.cwd()
const inputPath = inputArg
  ? path.resolve(cwd, inputArg)
  : path.resolve(cwd, "data/produkt_klima_tag_20240517_20251117_03126.txt")
const outputPath = outputArg ? path.resolve(cwd, outputArg) : inputPath.replace(/\.txt$/i, ".json")

function parseSemicolonLine(line) {
  // Einfacher parser, der semikolon trennt und Quotes unterstützt
  const cols = []
  let cur = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (ch === ";" && !inQuotes) {
      cols.push(cur)
      cur = ""
      continue
    }
    cur += ch
  }
  cols.push(cur)
  return cols.map((c) => c.trim())
}

function convertValue(v) {
  if (v === "" || v === "-" || v.toLowerCase() === "na" || v.toLowerCase() === "null") return null
  // Remove spaces inside weird numeric formatting
  const cleaned = v.replace(/\s+/g, "")
  if (/^-?\d+$/.test(cleaned)) return Number(cleaned)
  if (/^-?\d+[,\.]\d+$/.test(cleaned)) return Number(cleaned.replace(",", "."))
  return v
}

try {
  const raw = fs.readFileSync(inputPath, "utf8")
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length === 0) throw new Error("Eingabedatei ist leer")

  const headerLine = lines[0]
  const headers = parseSemicolonLine(headerLine).map((h) => h.trim())

  // Wenn am Ende eine Spalte namens 'eor' vorhanden ist, entfernen wir sie
  const dropEor = headers[headers.length - 1].toLowerCase() === "eor"
  if (dropEor) headers.pop()

  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const parts = parseSemicolonLine(lines[i])
    // Entferne trailing 'eor' wenn vorhanden
    if (parts.length > 0 && parts[parts.length - 1].toLowerCase() === "eor") parts.pop()
    // Skip lines that don't match header length (but allow extra whitespace cols)
    if (parts.length < headers.length) continue
    const obj = {}
    for (let j = 0; j < headers.length; j++) {
      const key = headers[j]
      const val = parts[j] !== undefined ? parts[j] : ""
      obj[key] = convertValue(val)
    }
    rows.push(obj)
  }

  fs.writeFileSync(outputPath, JSON.stringify(rows, null, 2), "utf8")
  console.log(`Converted ${rows.length} rows -> ${outputPath}`)
} catch (err) {
  console.error("Fehler bei Konvertierung:", err.message || err)
  process.exit(1)
}
