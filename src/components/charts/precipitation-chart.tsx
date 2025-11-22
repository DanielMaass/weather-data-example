import { CloudRainWind } from 'lucide-react';
import { useState } from 'react';
import { Bar, Brush, ComposedChart, Scatter, Tooltip, XAxis, ZAxis } from "recharts";
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { TooltipProps } from 'recharts/types/component/Tooltip';
import { usePrecipitation } from '../../context/precipitation-context';
import { cn } from '../../lib/utils';
import { formatShortDate } from '../../utils/formatShortDate';
import { Button } from '../ui/button';
import { ChartConfig, ChartContainer } from "../ui/chart";

const chartConfig = {
  value: {
    label: "Niederschlag",
    color: "var(--color-precipitation)",
  },
  max: {
    label: "max. Niederschlag (gesamt)",
    color: "#FFA500",
  },
  min: {
    label: "min. Niederschlag (gesamt)",
    color: "#3B8CFF",
  },

} as const satisfies ChartConfig

export function PrecipitationChart()  {
  const { data, from, to, max } = usePrecipitation()
  const [showMax, setShowMax] = useState(false)

  return (
    <>
    <div className='flex justify-between'>
      <p className="text-xs">Niederschlag in mm</p>
      <p className="text-xs">Zeitraum von {formatShortDate(from)} bis {formatShortDate(to)}</p>
    </div>
    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full ">
      <ComposedChart
        className="[&>.recharts-surface]:overflow-visible"
        data={data}
        margin={{
          top: 10,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        >
        <XAxis
          dataKey="date"
          tickLine={true}
          height={50}
          tickMargin={8}
          stroke='var(--muted-foreground)'
          tickSize={4}
          minTickGap={24}
          tickFormatter={formatShortDate}
        />
        <Tooltip
          cursor={{fill: 'var(--muted-foreground)', opacity: 0.1}}
          content={(props) => <CustomToolTip {...props} />}
          />
        <Bar key="precipitation" dataKey="value" fill={chartConfig.value.color} />

          <Scatter
            key="scatter-max"
            dataKey="max"
            fill={chartConfig.max.color}
            shape='cross'
            hide={!showMax}
            isAnimationActive={false}
          />

        {data?.length > 150 && <Brush
          dataKey="date"
          stroke="var(--foreground)"
          fill="#00000000"
          tickFormatter={formatShortDate}
          className="[&>rect:first-of-type]:hidden [&>.recharts-surface]:overflow-visible [&>.recharts-brush-texts>text]:fill-precipitation overflow-visible"
          >
          <ComposedChart>
            <ZAxis type="number" dataKey="max" range={[20, 20]} />
            <Bar dataKey="value" fill="oklch(55.4% 0.046 257.417)" />
            <Scatter
              key="brush-scatter-max"
              dataKey="max"
              fill={chartConfig.max.color}
              shape='cross'
              hide={!showMax}
              isAnimationActive={false}
              className='pointer-events-none'
            />
          </ComposedChart>
        </Brush>}
      </ComposedChart>
    </ChartContainer>

    <Button variant="ghost" onClick={() => setShowMax((prev) => !prev)} className={cn("text-xs h-fit", showMax && "bg-muted-foreground/40")} style={{color: showMax ? chartConfig.max.color : undefined}}>
      <CloudRainWind className='w-6 h-6 size-6' />
      <div className='flex flex-col items-start'>
        <span>{chartConfig.max.label}</span>
        <span className='text-lg leading-4'>{max} mm</span>
      </div>
    </Button>
  </>
)}


function CustomToolTip({label, payload}: TooltipProps<ValueType, NameType>) {
  const dateLabel = formatShortDate(label)

  const getKey = (i: number): keyof typeof chartConfig | undefined =>
    (payload?.[i]?.name as keyof typeof chartConfig | undefined);

    const cfg0 = getKey(0) ? chartConfig[getKey(0)!] : undefined;

    return (
      <div className='space-y-1 p-2 rounded bg-background/20 backdrop-blur-xs border border-black/10 shadow-lg'>
        <p>{dateLabel}</p>
        <div className='flex gap-1 items-center'>
          <span className={`w-2 h-2 rounded`} style={{backgroundColor: cfg0?.color}}></span>
          <span className='grow text-left'>{cfg0?.label}</span>
          <span>{payload?.[0]?.value} mm</span>
        </div>
      </div>
    )
  }

  function CustomCursor() {
    return <rect width={12} height="100%" fill='red' stroke="blue" />
  }
