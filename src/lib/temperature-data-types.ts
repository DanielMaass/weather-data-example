export type TemperatureDataRow = {
  date: Date
  low?: number
  high?: number
  lowhigh?: [number, number]
  max?: number
  min?: number
}

export type TemperatureData = TemperatureDataRow[]
