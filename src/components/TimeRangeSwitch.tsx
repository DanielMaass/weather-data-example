import { useTemperature } from '../context/temperature-context';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { ButtonGroup } from './ui/button-group';

export function TimeRangeSwitch() {
  const { timeRange, setTimeRange } = useTemperature()

  return (
    <ButtonGroup aria-label="Zeitraum auswählen">
      <Button variant="ghost" size="sm" className={cn(timeRange === "1M" && "text-temperature bg-muted-foreground pointer-events-none")} onClick={() => setTimeRange("1M")}>
        1M
      </Button>
      <Button variant="ghost" size="sm" className={cn(timeRange === "6M" && "text-temperature bg-muted-foreground pointer-events-none")} onClick={() => setTimeRange("6M")}>
        6M
      </Button>
      <Button variant="ghost" size="sm" className={cn(timeRange === "1J" && "text-temperature bg-muted-foreground pointer-events-none")} onClick={() => setTimeRange("1J")}>
        1J
      </Button>
      <Button variant="ghost" size="sm" className={cn(timeRange === "Max" && "text-temperature bg-muted-foreground pointer-events-none")} onClick={() => setTimeRange("Max")}>
        Max
      </Button>
    </ButtonGroup>
  )
}
