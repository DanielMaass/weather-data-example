import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { describe, expect, it } from 'vitest'
import type { TimeRange } from '../../types'
import { TimeRangeSwitch } from '../TimeRangeSwitch'

function Harness() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>('Max')
  return (
    <>
      <TimeRangeSwitch
        useContextHook={() => ({ timeRange, setTimeRange })}
        ranges={['1M','6M','1J','Max']}
        color="temperature"
      />
      <div data-testid="current-range">{timeRange}</div>
    </>
  )
}

describe('TimeRangeSwitch', () => {
  it('renders all provided ranges', () => {
    render(<Harness />)
    const group = screen.getByRole('group', { name: /Zeitraum auswählen/i })
    const groupQueries = within(group)
    ;['1M','6M','1J','Max'].forEach(r => {
      expect(groupQueries.getByText(r)).toBeInTheDocument()
    })
  })

  it('allows switching and updates visual selection', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const group = screen.getByRole('group', { name: /Zeitraum auswählen/i })
    const q = within(group)
    const btn1M = q.getByText('1M')
    const btn6M = q.getByText('6M')
    const btnMax = q.getByText('Max')

    // Initial selected is Max
    expect(btnMax).toHaveClass('bg-muted-foreground')
    expect(btn1M).not.toHaveClass('bg-muted-foreground')

    await user.click(btn1M)
    expect(btn1M).toHaveClass('bg-muted-foreground')
    expect(btnMax).not.toHaveClass('bg-muted-foreground')

    await user.click(btn6M)
    expect(btn6M).toHaveClass('bg-muted-foreground')
    expect(btn1M).not.toHaveClass('bg-muted-foreground')
  })
})
