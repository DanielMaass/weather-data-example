import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'
import { TimeRange } from '../types'
import { Button } from './ui/button'
import { ButtonGroup } from './ui/button-group'

interface UseTimeRangeResult {
  timeRange: TimeRange
  setTimeRange: (r: TimeRange) => void
}

type TimeRangeSwitchProps = VariantProps<typeof timeRangeSwitchVariants> & {
  useContextHook: () => UseTimeRangeResult
  ranges?: readonly TimeRange[]
  ariaLabel?: string
}

const timeRangeSwitchVariants = cva('', {
  variants: {
    color: {
      temperature: 'text-temperature',
      precipitation: 'text-precipitation',
      humidity: 'text-humidity',
    }
  },
  defaultVariants: {
    color: 'temperature',
  }
})

export function TimeRangeSwitch({
  useContextHook,
  ranges = ['1M', '6M', '1J', 'Max'],
  ariaLabel = 'Zeitraum auswählen',
  color,
}: TimeRangeSwitchProps) {

  const { timeRange, setTimeRange } = useContextHook()

  return (
    <ButtonGroup aria-label={ariaLabel}>
      {ranges.map(r => (
        <Button
          key={r}
          variant='ghost'
          size='sm'
          className={cn(
            timeRange === r &&  timeRangeSwitchVariants({ color }),
            timeRange === r && "bg-muted-foreground pointer-events-none"
          )}
          onClick={() => setTimeRange(r)}
        >
          {r}
        </Button>
      ))}
    </ButtonGroup>
  )
}
