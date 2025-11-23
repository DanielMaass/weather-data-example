import { describe, expect, it } from 'vitest'
import type { TemperatureDataRow } from '../../types'
import { getDataInTimeRange } from '../getDataInTimeRange'

// Helper to build a date (local midnight) for readability
function d(yyyy: number, mm: number, dd: number) {
  return new Date(yyyy, mm - 1, dd)
}

describe('getDataInTimeRange', () => {
  // Sorted ascending (required: function relies on last element as newest)
  const data: TemperatureDataRow[] = [
    { date: d(2024, 11, 15), low: -1, high: 5 }, // more than 1 year before last (exclude for 1J)
    { date: d(2025, 4, 15), low: 2, high: 10 },  // for 6M cutoff (May)
    { date: d(2025, 5, 15), low: 3, high: 11 },  // June
    { date: d(2025, 9, 15), low: 6, high: 15 },  // September
    { date: d(2025, 10, 14), low: 7, high: 16 }, // October 14 (just before 1M threshold Oct 15)
    { date: d(2025, 10, 15), low: 7, high: 17 }, // October 15 (1M threshold start)
    { date: d(2025, 10, 16), low: 8, high: 18 }, // October 16
    { date: d(2025, 11, 14), low: 9, high: 19 }, // November 14
    { date: d(2025, 11, 15), low: 10, high: 20 }, // LAST DATE
  ]
  const lastDate = data[data.length - 1].date

  it('returns empty array for empty data', () => {
    expect(getDataInTimeRange([], '1M')).toEqual([])
  })

  it('Max returns all entries', () => {
    expect(getDataInTimeRange(data, 'Max')).toHaveLength(data.length)
  })

  it('1M returns entries from exactly one month before last date (inclusive)', () => {
    // lastDate is 2025-11-15 => threshold = 2025-10-15
    const oneMonth = getDataInTimeRange(data, '1M')
    const expected = data.filter(r => r.date >= new Date(lastDate.getFullYear(), lastDate.getMonth() - 1, lastDate.getDate()))
    expect(oneMonth).toEqual(expected)
    // Assert boundary behavior: includes Oct 15 but excludes Oct 14
    expect(oneMonth.some(r => r.date.getTime() === d(2025,10,15).getTime())).toBe(true)
    expect(oneMonth.some(r => r.date.getTime() === d(2025,10,14).getTime())).toBe(false)
  })

  it('6M returns entries from six months before last date (inclusive)', () => {
    // lastDate 2025-11-15 => threshold = 2025-05-15
    const sixMonths = getDataInTimeRange(data, '6M')
    const expected = data.filter(r => r.date >= new Date(lastDate.getFullYear(), lastDate.getMonth() - 6, lastDate.getDate()))
    expect(sixMonths).toEqual(expected)
    // Contains June 15 but excludes April 15
    expect(sixMonths.some(r => r.date.getTime() === d(2025,5,15).getTime())).toBe(true)
    expect(sixMonths.some(r => r.date.getTime() === d(2025,4,15).getTime())).toBe(false)
  })

  it('1J returns entries from one year before last date (inclusive)', () => {
    // lastDate 2025-11-15 => threshold = 2024-11-15
    const oneYear = getDataInTimeRange(data, '1J')
    const expected = data.filter(r => r.date >= new Date(lastDate.getFullYear() - 1, lastDate.getMonth(), lastDate.getDate()))
    expect(oneYear).toEqual(expected)
    // Includes 2024-11-15 boundary but excludes earlier dates if present
    expect(oneYear.some(r => r.date.getTime() === d(2024,11,15).getTime())).toBe(true)
  })
})
