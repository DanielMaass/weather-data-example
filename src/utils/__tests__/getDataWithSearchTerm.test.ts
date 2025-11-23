import { describe, expect, it } from 'vitest'
import type { TemperatureDataRow } from '../../types'
import { getDataWithSearchTerm } from '../getDataWithSearchTerm'

describe('getDataWithSearchTerm - numeric searches', () => {
  const sample = [
    { date: new Date(2024, 8, 6), value: 10 }, // 06 Sep 2024 (day 6)
    { date: new Date(2025, 5, 10), value: 20 }, // Jun (month 6)
    { date: new Date(2025, 8, 15), value: 6.5 }, // Sep value 6.5
    { date: new Date(2025, 8, 20), value: 0.6 }, // Sep value 0.6 (should not match 6)
    { date: new Date(2025, 8, 21), value: 7.6 }, // Sep value 7.6 (should not match 6)
  ] as any

  it('numeric integer search matches day, month or numeric prefix/decimal integer part', () => {
    const res = getDataWithSearchTerm(sample, '6')
    expect(res.some((r) => r.date.getDate() === 6)).toBe(true)
    expect(res.some((r) => (r as any).value === 6.5)).toBe(true)
    expect(res.some((r) => (r as any).value === 0.6)).toBe(false)
    expect(res.some((r) => (r as any).value === 7.6)).toBe(false)
  })

  it('numeric decimal search matches exact numeric value (comma allowed)', () => {
    const res = getDataWithSearchTerm(sample, '6,5')
    expect(res.length).toBe(1)
    expect((res[0] as any).value).toBe(6.5)
  })
})

describe('getDataWithSearchTerm - month searches', () => {
  function dateYMD(y: number, m: number, d: number) {
    return new Date(Date.UTC(y, m - 1, d))
  }

  const sample: TemperatureDataRow[] = [
    { date: dateYMD(2024, 9, 1), high: 10 }, // Sept 1, 2024
    { date: dateYMD(2025, 9, 15), high: 12 }, // Sept 15, 2025
    { date: dateYMD(2025, 10, 2), high: 5 }, // Oct 2, 2025
    { date: dateYMD(2023, 9, 30), high: 8 }, // Sept 30, 2023
    { date: dateYMD(2025, 9, 1), high: 9 }, // Sept 1, 2025
    { date: dateYMD(2024, 8, 21), high: 7 }, // Aug 21, 2024 (non-match)
  ]

  it('returns all entries for a month name regardless of year', () => {
    const res = getDataWithSearchTerm(sample as any, 'september')
    // Expect all entries with month === September (month index 8)
    expect(res.length).toBe(4)
    expect(res.every((r) => r.date.getMonth() === 8)).toBe(true)
  })

  it('returns only entries for month+year when year provided', () => {
    const res = getDataWithSearchTerm(sample as any, 'september2025')
    expect(res.length).toBe(2)
    expect(res.every((r) => r.date.getMonth() === 8 && r.date.getFullYear() === 2025)).toBe(true)
  })

  it('returns only exact day+month when day provided', () => {
    const res = getDataWithSearchTerm(sample as any, '1.09')
    // two entries: 2024-09-01 and 2025-09-01
    expect(res.length).toBe(2)
    expect(res.every((r) => r.date.getDate() === 1 && r.date.getMonth() === 8)).toBe(true)
  })
})

type Row = { date: Date; value?: number; low?: number; high?: number }

const sample: Row[] = [
  { date: new Date(2024, 8, 6), value: 10 }, // 06 Sep 2024 (day 6)
  { date: new Date(2025, 5, 10), value: 20 }, // Jun (month 6)
  { date: new Date(2025, 8, 15), value: 6.5 }, // Sep value 6.5
  { date: new Date(2025, 8, 20), value: 0.6 }, // Sep value 0.6 (should not match 6)
  { date: new Date(2025, 8, 21), value: 7.6 }, // Sep value 7.6 (should not match 6)
]

describe('getDataWithSearchTerm', () => {
  it('returns all rows for month name (september)', () => {
    const res = getDataWithSearchTerm(sample as any, 'september')
    expect(res.length).toBeGreaterThan(0)
    // all rows with month September (month index 8)
    expect(res.every((r) => r.date.getMonth() === 8)).toBe(true)
  })

  it('numeric integer search matches day, month or numeric prefix/decimal integer part', () => {
    const res = getDataWithSearchTerm(sample as any, '6')
    // should match row with day=6 and row with value 6.5
    expect(res.some((r) => r.date.getDate() === 6)).toBe(true)
    expect(res.some((r) => (r as any).value === 6.5)).toBe(true)
    // should not include the 0.6 or 7.6 rows
    expect(res.some((r) => (r as any).value === 0.6)).toBe(false)
    expect(res.some((r) => (r as any).value === 7.6)).toBe(false)
  })

  it('numeric decimal search matches exact numeric value (comma allowed)', () => {
    const res = getDataWithSearchTerm(sample as any, '6,5')
    expect(res.length).toBe(1)
    expect((res[0] as any).value).toBe(6.5)
  })

  it('non-matching term returns empty array', () => {
    const res = getDataWithSearchTerm(sample as any, 'nomatch')
    expect(res).toEqual([])
  })

  it('combined numeric + date: searching "14.1" matches both a 14 Jan date and a numeric 14.1 value', () => {
    const rows: any[] = [
      { date: new Date(2025, 0, 14), high: 5 }, // 14 Jan 2025 (date match)
      { date: new Date(2025, 0, 10), value: 14.1 }, // numeric value match
    ]
    const res = getDataWithSearchTerm(rows, '14.1')
    expect(res.some((r) => r.date.getDate() === 14 && r.date.getMonth() === 0)).toBe(true)
    expect(res.some((r) => (r as any).value === 14.1)).toBe(true)
  })
})

function dateYMD(y: number, m: number, d: number) {
  return new Date(Date.UTC(y, m - 1, d))
}

