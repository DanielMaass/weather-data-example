import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TemperatureProvider } from '../../context/temperature-context'
import { TemperatureChart } from '../charts/temperature-chart'
import { TemperatureTable } from '../tables/temperature-table'

// Sample weather data (3 days) with varying TXK (high) values
const sampleWeatherData = [
  { STATIONS_ID: 1, MESS_DATUM: 20250101, TXK: 10, TNK: -1 },
  { STATIONS_ID: 1, MESS_DATUM: 20250102, TXK: 30, TNK: 5 },
  { STATIONS_ID: 1, MESS_DATUM: 20250103, TXK: 20, TNK: 0 },
] as any

// Mock react-query to inject sample data into provider
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: sampleWeatherData, isLoading: false, isError: false }),
}))

// Capture chart data passed to ComposedChart
let lastChartData: any[] | undefined
vi.mock('recharts', async () => {
  const Stub = (props: any) => <div data-stub>{props.children}</div>
  return {
    ComposedChart: (props: any) => {
      lastChartData = props.data
      return <div data-testid="chart">{props.children}</div>
    },
    Line: Stub,
    Scatter: Stub,
    Tooltip: Stub,
    XAxis: Stub,
    Brush: Stub,
    Bar: Stub,
    ZAxis: Stub,
    Legend: Stub,
    ResponsiveContainer: Stub,
    CartesianGrid: Stub,
    YAxis: Stub,
  }
})

describe('Temperature sorting synchronizes chart data', () => {
  it('updates chart data order when table is sorted by high values', async () => {
    const user = userEvent.setup()
    render(
      <TemperatureProvider>
        <TemperatureTable />
        <TemperatureChart />
      </TemperatureProvider>
    )

    // Initial order (by date, ascending) -> highs: [10,30,20]
    expect(lastChartData?.map(d => d.high)).toEqual([10, 30, 20])

    // Click high header via test id: sorts descending first
    const highHeader = screen.getByTestId('temperature-high-header')
    await user.click(highHeader)
    expect(lastChartData?.map(d => d.high)).toEqual([30, 20, 10])

    // Second click toggles to ascending
    await user.click(highHeader)
    expect(lastChartData?.map(d => d.high)).toEqual([10, 20, 30])
  })
})
