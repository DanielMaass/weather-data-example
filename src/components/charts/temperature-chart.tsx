import { ThermometerSnowflake, ThermometerSun } from 'lucide-react';
import { useState } from 'react';
import { Bar, Brush, ComposedChart, Line, Scatter, Tooltip, XAxis, ZAxis } from "recharts";
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { TooltipProps } from 'recharts/types/component/Tooltip';
import { useTemperature } from '../../context/temperature-context';
import { cn } from '../../lib/utils';
import { formatShortDate } from '../../utils/formatShortDate';
import { Button } from '../ui/button';
import { ChartConfig, ChartContainer } from "../ui/chart";

const chartConfig = {
  low: {
    label: "Tiefstwert",
    color: "#3F65A4",
  },
  high: {
    label: "Höchstwert",
    color: "#C19F19",
  },
  max: {
    label: "Höchsttemp. (gesamt)",
    color: "#FFA500",
  },
  min: {
    label: "Tiefsttemp. (gesamt)",
    color: "#3B8CFF",
  },

} as const satisfies ChartConfig

export function TemperatureChart()  {
  const { data, from, to, maxTemp, minTemp } = useTemperature()
  const [showMaxTemp, setShowMaxTemp] = useState(false)
  const [showMinTemp, setShowMinTemp] = useState(false)

  return (
    <>
    <div className='flex justify-between'>
      <p className="text-xs">Temperaturen in °C</p>
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
          cursor={false}
          content={(props) => <CustomToolTip {...props} />}
          />
        <Line key="line-low" dataKey="low" stroke={chartConfig.low.color} dot={false} isAnimationActive={false} />
        <Line key="line-high" dataKey="high" stroke={chartConfig.high.color} dot={false} isAnimationActive={false} />
          <Scatter
            key="scatter-max"
            dataKey="maxTemp"
            fill={chartConfig.max.color}
            shape='cross'
            hide={!showMaxTemp}
            isAnimationActive={false}
          />
          <Scatter
            key="scatter-min"
            dataKey="minTemp"
            fill={chartConfig.min.color}
            shape='cross'
            hide={!showMinTemp}
            isAnimationActive={false}
          />
        {data?.length > 150 && <Brush
          dataKey="date"
          stroke="var(--foreground)"
          fill="#00000000"
          tickFormatter={formatShortDate}
          className="[&>rect:first-of-type]:hidden [&>.recharts-surface]:overflow-visible [&>.recharts-brush-texts>text]:fill-temperature overflow-visible"
          >
          <ComposedChart>
            <ZAxis type="number" dataKey="maxTemp" range={[20, 20]} />
            <Bar dataKey="lowhigh" fill="oklch(55.4% 0.046 257.417)" />
            <Scatter
              key="brush-scatter-max"
              dataKey="maxTemp"
              fill={chartConfig.max.color}
              shape='cross'
              hide={!showMaxTemp}
              isAnimationActive={false}
              className='pointer-events-none'
            />
            <Scatter
              key="brush-scatter-min"
              dataKey="minTemp"

              fill={chartConfig.min.color}
              shape='cross'
              hide={!showMinTemp}
              isAnimationActive={false}
            />
          </ComposedChart>
        </Brush>}
      </ComposedChart>
    </ChartContainer>
    <div className='flex gap-1'>
      <Button variant="ghost" onClick={() => setShowMaxTemp((prev) => !prev)} className={cn("text-xs h-fit", showMaxTemp && "bg-muted-foreground/40")} style={{color: showMaxTemp ? chartConfig.max.color : undefined}}><ThermometerSun className='w-6 h-6 size-6' />
      <div className='flex flex-col items-start'>
        <span>{chartConfig.max.label}</span>
        <span className='text-lg leading-4'>{maxTemp}°C</span>
        </div>
        </Button>
      <Button variant="ghost" onClick={() => setShowMinTemp((prev) => !prev)} className={cn("text-xs h-fit", showMinTemp && "bg-muted-foreground/40")} style={{color: showMinTemp ? chartConfig.min.color : undefined}}><ThermometerSnowflake className='w-6 h-6 size-6' />
      <div className='flex flex-col items-start'>
        <span>{chartConfig.min.label}</span>
        <span className='text-lg leading-4'>{minTemp}°C</span>
        </div>
        </Button>
    </div>
  </>
)}


function CustomToolTip({label, payload}: TooltipProps<ValueType, NameType>) {
  const dateLabel = label?.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" })

  const getKey = (i: number): keyof typeof chartConfig | undefined =>
    (payload?.[i]?.name as keyof typeof chartConfig | undefined);

    const cfg1 = getKey(1) ? chartConfig[getKey(1)!] : undefined;
    const cfg0 = getKey(0) ? chartConfig[getKey(0)!] : undefined;

    return (
      <div className='space-y-1 p-2 rounded bg-background/20 backdrop-blur-xs border border-black/10 shadow-lg'>
        <p>{dateLabel}</p>
        <div className='flex gap-1 items-center'>
          <span className={`w-2 h-2 rounded`} style={{backgroundColor: cfg1?.color}}></span>
          <span className='grow text-left'>{cfg1?.label}</span>
          <span>{payload?.[1]?.value}°C</span>
        </div>
        <div className='flex gap-1 items-center'>
          <span className={`w-2 h-2 rounded`} style={{backgroundColor: cfg0?.color}}></span>
          <span className='grow text-left'>{cfg0?.label}</span>
          <span>{payload?.[0]?.value}°C</span>
        </div>
      </div>
    )
  }
