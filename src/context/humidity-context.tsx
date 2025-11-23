import { useQuery } from '@tanstack/react-query'
import { SortingState } from '@tanstack/react-table'
import { createContext, useContext, useMemo, useState } from 'react'
import { magdeburgDataQuery } from '../lib/magdeburgData.query'
import { HumidityContextValue, PrecipitationContextValue, TimeRange } from '../types'
import { addMaxValues } from '../utils/addMaxValues'
import { getDataInTimeRange } from '../utils/getDataInTimeRange'
import { getDataWithSearchTerm } from '../utils/getDataWithSearchTerm'
import { getHumidityData } from '../utils/getHumidityData'
import { sortByTableSort } from '../utils/sortByTableSort'

const HumidityContext = createContext<HumidityContextValue | undefined>(undefined)

export function HumidityProvider({ children }: { children: React.ReactNode }) {
  //original data
  const { data, isLoading, isError } = useQuery(magdeburgDataQuery)
  //state management
  const [sorting, setSorting] = useState<SortingState>([])
  const [timeRange, setTimeRange] = useState<TimeRange>('Max')
  const [searchTerm, setSearchTerm] = useState<string>('')
  // data processing
  const humidityData = useMemo(() => getHumidityData(data), [data])
  const timeRangeData = useMemo(() => getDataInTimeRange(humidityData, timeRange), [humidityData, timeRange])
  const searchTermData = useMemo(() => getDataWithSearchTerm(timeRangeData, searchTerm), [timeRangeData, searchTerm])
  const { data: tempData, max } = useMemo(() => addMaxValues(searchTermData), [searchTermData])
  const tableSortData = useMemo(() => sortByTableSort(tempData, sorting), [tempData, sorting])

  const [from, to] = useMemo(() => {
    if (!tempData?.length) return [null, null]
    const sortedByDate = tempData.toSorted((a, b) => a.date.getTime() - b.date.getTime())
    return [sortedByDate[0].date, sortedByDate[sortedByDate.length - 1].date]
  }, [tempData])


  const value: PrecipitationContextValue = {
    data: tableSortData,
    timeRange,
    setTimeRange,
    sorting,
    setSorting,
    from,
    to,
    max,
    searchTerm,
    setSearchTerm,
    isLoading,
    isError,
  }

  return <HumidityContext.Provider value={value}>{children}</HumidityContext.Provider>
}

export function useHumidity() {
  const ctx = useContext(HumidityContext)
  if (!ctx) throw new Error('useHumidity must be used within HumidityProvider')
  return ctx
}
