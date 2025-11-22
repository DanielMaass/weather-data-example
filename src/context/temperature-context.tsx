import { useQuery } from '@tanstack/react-query'
import { SortingState } from '@tanstack/react-table'
import { createContext, useContext, useMemo, useState } from 'react'
import { magdeburgDataQuery } from '../lib/magdeburgData.query'
import type { TemperatureData, TemperatureDataRow } from '../lib/temperature-data-types'
import type { WeatherDataRow } from '../lib/weather-data-types'

type TimeRange = '1M' | '6M' | '1J' | 'Max'

interface TemperatureContextValue {
  temperatureData: TemperatureData
  timeRange: TimeRange
  setTimeRange: (r: TimeRange) => void
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  from: Date | null
  to: Date | null
  maxTemp: number | null
  minTemp: number | null
  isLoading: boolean
  isError: boolean
}

const TemperatureContext = createContext<TemperatureContextValue | undefined>(undefined)

export function TemperatureProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError } = useQuery(magdeburgDataQuery)
  const [sorting, setSorting] = useState<SortingState>([])
  const [timeRange, setTimeRange] = useState<TimeRange>('Max')

  const temperatureData: TemperatureData = useMemo(() => {
    if (!data) return []
    const convertedData: TemperatureDataRow[] = data
      .map(({ MESS_DATUM, TNK, TXK }: Pick<WeatherDataRow, 'MESS_DATUM' | 'TNK' | 'TXK'>) => {
        const year = MESS_DATUM.toString().slice(0, 4)
        const month = MESS_DATUM.toString().slice(4, 6)
        const day = MESS_DATUM.toString().slice(6, 8)
        const date = new Date(Number(year), Number(month) - 1, Number(day))
        const lowhigh: [number, number] | undefined = TNK && TXK ? [TNK, TXK] : undefined
        return {
          date,
          low: TNK,
          high: TXK,
          lowhigh,
        }
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    const lastDate = convertedData?.[convertedData.length - 1]?.date
    let firstDate = convertedData?.[0]?.date
    if (lastDate) {
      if (timeRange === '1M') {
        firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth() - 1, lastDate.getDate())
      } else if (timeRange === '6M') {
        firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth() - 6, lastDate.getDate())
      } else if (timeRange === '1J') {
        firstDate = new Date(lastDate.getFullYear() - 1, lastDate.getMonth(), lastDate.getDate())
      }
    }

    const filtered = convertedData.filter((d) => (firstDate ? d.date >= firstDate : true))
    const highs = filtered.map((d) => d.high).filter((v): v is number => v != null)
    const lows = filtered.map((d) => d.low).filter((v): v is number => v != null)
    const max = highs.length ? Math.max(...highs) : undefined
    const min = lows.length ? Math.min(...lows) : undefined

    let base: TemperatureDataRow[] = filtered.map((i) => {
      if (max != null && i.high === max) {
        return { ...i, max: i.high }
      }
      if (min != null && i.low === min) {
        return { ...i, min: i.low }
      }
      return i
    })

    if (sorting.length) {
      const compare = (a: any, b: any) => {
        for (const { id, desc } of sorting) {
          const va = a[id]
          const vb = b[id]
          if (va == null && vb == null) continue
          if (va == null) return desc ? 1 : -1
          if (vb == null) return desc ? -1 : 1
          if (va instanceof Date && vb instanceof Date) {
            const diff = va.getTime() - vb.getTime()
            if (diff !== 0) return desc ? -diff : diff
            continue
          }
            if (typeof va === 'number' && typeof vb === 'number') {
            const diff = va - vb
            if (diff !== 0) return desc ? -diff : diff
            continue
          }
          const sva = String(va)
          const svb = String(vb)
          if (sva === svb) continue
          return (sva < svb ? -1 : 1) * (desc ? -1 : 1)
        }
        return 0
      }
      base = [...base].sort(compare)
    }
    return base
  }, [data, timeRange, sorting])

  const from = useMemo(() => {
    if (!temperatureData.length) return null
    const sortedByDate = [...temperatureData].sort((a, b) => a.date.getTime() - b.date.getTime())
    return sortedByDate[0].date
  }, [temperatureData])

  const to = useMemo(() => {
    if (!temperatureData.length) return null
    const sortedByDate = [...temperatureData].sort((a, b) => b.date.getTime() - a.date.getTime())
    return sortedByDate[0].date
  }, [temperatureData])

  const maxTemp = useMemo(() => temperatureData.find(d => d.max !== undefined)?.max ?? null, [temperatureData])
  const minTemp = useMemo(() => temperatureData.find(d => d.min !== undefined)?.min ?? null, [temperatureData])

  const value: TemperatureContextValue = {
    temperatureData,
    timeRange,
    setTimeRange,
    sorting,
    setSorting,
    from,
    to,
    maxTemp,
    minTemp,
    isLoading,
    isError,
  }

  return <TemperatureContext.Provider value={value}>{children}</TemperatureContext.Provider>
}

export function useTemperature() {
  const ctx = useContext(TemperatureContext)
  if (!ctx) throw new Error('useTemperature must be used within TemperatureProvider')
  return ctx
}
