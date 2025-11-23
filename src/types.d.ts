import type { SortingState } from '@tanstack/react-table'

export type TemperatureDataRow = {
  date: Date
  low?: number
  high?: number
  lowhigh?: [number, number]
  maxTemp?: number
  minTemp?: number
}

export type PrecipitationDataRow = {
  date: Date
  value?: number
  maxValue?: number
  minValue?: number
}

export type HumidityDataRow = {
  date: Date
  value?: number
  maxValue?: number
  minValue?: number
}

type BaseContextValue = {
  timeRange: TimeRange
  setTimeRange: (r: TimeRange) => void
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  from: Date | null
  to: Date | null
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  isLoading: boolean
  isError: boolean
}

type TemperatureContextValue = BaseContextValue & {
  data: TemperatureDataRow[]
  maxTemp: number | null
  minTemp: number | null
}

type PrecipitationContextValue = BaseContextValue & {
  data: PrecipitationDataRow[]
  max: number | null
}

type HumidityContextValue = BaseContextValue & {
  data: HumidityDataRow[]
  max: number | null
}

type TimeRange = '1M' | '6M' | '1J' | 'Max'
