import { useQuery } from '@tanstack/react-query'
import type { SortingState } from '@tanstack/react-table'
import { createContext, useContext, useMemo, useState } from 'react'
import { magdeburgDataQuery } from '../lib/magdeburgData.query'
import type { TemperatureContextValue, TimeRange } from '../types'
import { addMaxMinTempValues } from '../utils/addMaxMinTempValues'
import { getDataInTimeRange } from '../utils/getDataInTimeRange'
import { getDataWithSearchTerm } from '../utils/getDataWithSearchTerm'
import { getTemperatureData } from '../utils/getTemperatureData'
import { sortByTableSort } from '../utils/sortByTableSort'

const TemperatureContext = createContext<TemperatureContextValue | undefined>(undefined)

export function TemperatureProvider({ children }: { children: React.ReactNode }) {
  //original data
  const { data, isLoading, isError } = useQuery(magdeburgDataQuery)
  //state management
  const [sorting, setSorting] = useState<SortingState>([])
  const [timeRange, setTimeRange] = useState<TimeRange>('Max')
  const [searchTerm, setSearchTerm] = useState<string>('')
  // data processing
  const temperatureData = useMemo(() => getTemperatureData(data), [data])
  const timeRangeData = useMemo(() => getDataInTimeRange(temperatureData, timeRange), [temperatureData, timeRange])
  const searchTermData = useMemo(() => getDataWithSearchTerm(timeRangeData, searchTerm), [timeRangeData, searchTerm])
  const { data: tempData, maxTemp, minTemp } = useMemo(() => addMaxMinTempValues(searchTermData), [searchTermData])
  const tableSortData = useMemo(() => sortByTableSort(tempData, sorting), [tempData, sorting])

  const [from, to] = useMemo(() => {
    if (!tempData?.length) return [null, null]
    const sortedByDate = tempData.toSorted((a, b) => a.date.getTime() - b.date.getTime())
    return [sortedByDate[0].date, sortedByDate[sortedByDate.length - 1].date]
  }, [tempData])


  const value: TemperatureContextValue = {
    data: tableSortData,
    timeRange,
    setTimeRange,
    sorting,
    setSorting,
    from,
    to,
    maxTemp,
    minTemp,
    searchTerm,
    setSearchTerm,
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
