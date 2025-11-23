import { describe, expect, it } from 'vitest'
import { formatShortDate } from '../formatShortDate'

describe('formatShortDate', () => {
  it('returns empty string for null', () => {
    expect(formatShortDate(null)).toBe('')
  })

  it('formats date in de-DE locale with two-digit parts', () => {
    const d = new Date('2025-11-23T12:34:56Z')
    // Expect 23.11.25 (German format)
    expect(formatShortDate(d)).toBe('23.11.25')
  })
})
