import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TemperatureProvider, useTemperature } from '../../context/temperature-context'
import { Search } from '../Search'

// Create sample weather data with two dates sharing same day+month across different years
const sampleWeatherData = [
  { STATIONS_ID: 1, MESS_DATUM: 20240115, TXK: 5,  TNK: -2 },  // 15 Jan 2024
  { STATIONS_ID: 1, MESS_DATUM: 20250115, TXK: 12, TNK: 1 },   // 15 Jan 2025
  { STATIONS_ID: 1, MESS_DATUM: 20250210, TXK: 8,  TNK: 0 },   // 10 Feb 2025 (non-match)
  { STATIONS_ID: 1, MESS_DATUM: 20240303, TXK: 9,  TNK: 1 },   // 03 Mar 2024
  { STATIONS_ID: 1, MESS_DATUM: 20250303, TXK: 15, TNK: 4 },   // 03 Mar 2025
] as any

// Mock react-query to feed provider
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: sampleWeatherData, isLoading: false, isError: false }),
}))

function TemperatureSearch() {
  const { searchTerm, setSearchTerm } = useTemperature()
  return <Search useContextHook={() => ({ searchTerm, setSearchTerm })} color="temperature" />
}

function DataEcho() {
  const { data } = useTemperature()
  return (
    <div data-testid="dates">
      {data.map(d => (
        <span key={d.date.toISOString()}>{d.date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
      ))}
    </div>
  )
}

describe('Date search returns all matching day+month entries', () => {
  it('searching "15.01" finds both Jan 15 entries and filters out others', async () => {
    const user = userEvent.setup()

    render(
      <TemperatureProvider>
        <TemperatureSearch />
        <DataEcho />
      </TemperatureProvider>
    )

    // Activate search input
    const activateBtn = screen.getByRole('button')
    await user.click(activateBtn)

    const input = screen.getByTestId('search-input')
    await user.type(input, '15.01')

    // Debounce is 500ms
    await new Promise(r => setTimeout(r, 600))

    const dateContainer = screen.getByTestId('dates')
    const dateTexts = Array.from(dateContainer.querySelectorAll('span')).map(el => el.textContent || '')
    expect(dateTexts.length).toBe(2)
    expect(dateTexts.some(t => /2024/.test(t))).toBe(true)
    expect(dateTexts.some(t => /2025/.test(t))).toBe(true)
    expect(dateTexts.some(t => /Feb/.test(t))).toBe(false)

    // done
  })

  it('searching "03.03" finds both March 03 entries and filters out others', async () => {
    const user = userEvent.setup()
    render(
      <TemperatureProvider>
        <TemperatureSearch />
        <DataEcho />
      </TemperatureProvider>
    )
    const activateBtn = screen.getByRole('button')
    await user.click(activateBtn)
    const input = screen.getByTestId('search-input')
    await user.type(input, '03.03')
    await new Promise(r => setTimeout(r, 600))
    const dateContainer = screen.getByTestId('dates')
    const dateTexts = Array.from(dateContainer.querySelectorAll('span')).map(el => el.textContent || '')
    expect(dateTexts.length).toBe(2)
    expect(dateTexts.some(t => /2024/.test(t))).toBe(true)
    expect(dateTexts.some(t => /2025/.test(t))).toBe(true)
    // Ensure January or February only not exclusive, but we ensure March days present
    expect(dateTexts.every(t => /03\. Mär/.test(t!))).toBe(true)
  })

  it('searching textual month with umlaut ("3.Mär") and ae replacement ("3.maer") matches March 03 entries', async () => {
    const user = userEvent.setup()
    const searchAndAssert = async (term: string) => {
      render(
        <TemperatureProvider>
          <TemperatureSearch />
          <DataEcho />
        </TemperatureProvider>
      )
      const activateBtn = screen.getByRole('button')
      await user.click(activateBtn)
      const input = screen.getByTestId('search-input')
      await user.type(input, term)
      await new Promise(r => setTimeout(r, 600))
      const dateContainer = screen.getByTestId('dates')
      const dateTexts = Array.from(dateContainer.querySelectorAll('span')).map(el => el.textContent || '')
      expect(dateTexts.length).toBe(2)
      expect(dateTexts.some(t => /2024/.test(t))).toBe(true)
      expect(dateTexts.some(t => /2025/.test(t))).toBe(true)
      // Clean up DOM between runs
      document.body.innerHTML = ''
    }
    await searchAndAssert('3.Mär')
    await searchAndAssert('3.maer')
  })
})
