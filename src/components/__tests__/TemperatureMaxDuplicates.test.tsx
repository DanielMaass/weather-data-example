import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TemperatureProvider } from '../../context/temperature-context'
import { TemperatureChart } from '../charts/temperature-chart'
import { TemperatureTable } from '../tables/temperature-table'

// Two rows share the same max TXK value (30) so both should get maxTemp flag
const sampleWeatherData = [
  { STATIONS_ID: 1, MESS_DATUM: 20250101, TXK: 30, TNK: -2 },
  { STATIONS_ID: 1, MESS_DATUM: 20250102, TXK: 10, TNK: 0 },
  { STATIONS_ID: 1, MESS_DATUM: 20250103, TXK: 30, TNK: 1 },
] as any

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: sampleWeatherData, isLoading: false, isError: false }),
}))

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

describe('TemperatureChart duplicate max values', () => {
  it('shows multiple max scatter points when identical max highs exist and max toggle is activated', async () => {
    const user = userEvent.setup()
    render(
      <TemperatureProvider>
        <TemperatureTable />
        <TemperatureChart />
      </TemperatureProvider>
    )

    // Initially scatter points hidden, but data already enriched with maxTemp on two rows
    const maxFlagCountInitial = lastChartData?.filter(d => d.maxTemp != null).length
    expect(maxFlagCountInitial).toBe(2)

    // Toggle show max temps button (first button with ThermometerSun icon / label Höchsttemp.)
    const maxButton = screen.getByTestId('toggle-max-temp')
    await user.click(maxButton)

    // After toggle, still two entries carry maxTemp (data structure unchanged)
    const maxFlagCountAfter = lastChartData?.filter(d => d.maxTemp != null).length
    expect(maxFlagCountAfter).toBe(2)
  })
})
