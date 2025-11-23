import { describe, expect, it } from 'vitest'
import { parseDateSearch } from '../parseDateSearch'

describe('parseDateSearch', () => {
  it('parses full month name and abbreviated forms', () => {
    expect(parseDateSearch('s')).toEqual({ month: 8 })
    expect(parseDateSearch('september')).toEqual({ month: 8 })
    expect(parseDateSearch('sept')).toEqual({ month: 8 })
    expect(parseDateSearch('SepT')).toEqual({ month: 8 })
  })

  it('parses month+year', () => {
    expect(parseDateSearch('Sept. 2025')).toEqual({ month: 8, year: 2025 })
    expect(parseDateSearch('Sept.2025')).toEqual({ month: 8, year: 2025 })
    expect(parseDateSearch('Sept 2025')).toEqual({ month: 8, year: 2025 })
    expect(parseDateSearch('september2025')).toEqual({ month: 8, year: 2025 })
    expect(parseDateSearch('september 2025')).toEqual({ month: 8, year: 2025 })
    expect(parseDateSearch('sept25')).toEqual({ month: 8, year: 2025 })
    expect(parseDateSearch('sept 25')).toEqual({ month: 8, year: 2025 })
  })

  it('parses textual day + month', () => {
    expect(parseDateSearch('21.sep')).toEqual({ day: 21, month: 8 })
    expect(parseDateSearch('21. sep')).toEqual({ day: 21, month: 8 })
    expect(parseDateSearch('21. Sep')).toEqual({ day: 21, month: 8 })
    expect(parseDateSearch('21. S')).toEqual({ day: 21, month: 8 })
    expect(parseDateSearch('03.maerz.2025')).toEqual({ day: 3, month: 2, year: 2025 })
    expect(parseDateSearch('03.Maerz 2025')).toEqual({ day: 3, month: 2, year: 2025 })
    expect(parseDateSearch('03.Maerz 25')).toEqual({ day: 3, month: 2, year: 2025 })
    expect(parseDateSearch('03. Maerz 2025')).toEqual({ day: 3, month: 2, year: 2025 })
  })
})

describe('parseDateSearch - additional patterns', () => {
  it('parses month-only names', () => {
    expect(parseDateSearch('september')).toEqual({ month: 8 })
    expect(parseDateSearch('Sept')).toEqual({ month: 8 })
    expect(parseDateSearch('maerz')).toEqual({ month: 2 })
    expect(parseDateSearch('maer')).toEqual({ month: 2 })
  })

  it('parses month + year', () => {
    expect(parseDateSearch('sept25')).toEqual({ month: 8, year: 2025 })
    expect(parseDateSearch('september2023')).toEqual({ month: 8, year: 2023 })
  })

  it('parses day + month (textual and numeric)', () => {
    expect(parseDateSearch('21.sep')).toEqual({ day: 21, month: 8 })
    expect(parseDateSearch('21.9')).toEqual({ day: 21, month: 8 })
    expect(parseDateSearch('21.09')).toEqual({ day: 21, month: 8 })
    expect(parseDateSearch('03.maerz')).toEqual({ day: 3, month: 2 })
  })

  it('parses day + month + year', () => {
    expect(parseDateSearch('21.sep2025')).toEqual({ day: 21, month: 8, year: 2025 })
    expect(parseDateSearch('03.03.2024')).toEqual({ day: 3, month: 2, year: 2024 })
  })
})
