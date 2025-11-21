import { ThermometerSnowflake, ThermometerSun } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Bar, Brush, ComposedChart, Line, Scatter, Tooltip, XAxis } from "recharts";
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { TooltipProps } from 'recharts/types/component/Tooltip';
import { TemperatureData } from "../../lib/temperature-data-types";
import { cn } from '../../lib/utils';
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

export function TemperatureChart({ data = [] }: { data?: TemperatureData  })  {
  const [showMaxTemp, setShowMaxTemp] = useState(false)
  const [showMinTemp, setShowMinTemp] = useState(false)
  const maxTemp = useMemo(() => data.filter(d => d.max !== undefined)?.[0].max, [data])
  const minTemp = useMemo(() => data.filter(d => d.min !== undefined)?.[0].min, [data])

  return (
    <>
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
          tickFormatter={(date) =>
            date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" })
          }
          />
        <Tooltip
          cursor={false}
          content={(props) => <CustomToolTip {...props} />}
          />
        {showMaxTemp && <Scatter dataKey="max" fill={chartConfig.max.color} shape='cross' />}
        {showMinTemp && <Scatter dataKey="min" fill={chartConfig.min.color} shape="cross"/>}
        <Line dataKey="low"  stroke={chartConfig.low.color} dot={false} />
        <Line dataKey="high" stroke={chartConfig.high.color} dot={false} />
        {data?.length > 150 && <Brush
          dataKey="date"
          stroke="var(--foreground)" //"oklch(85.2% 0.199 91.936 / 0.4)"
          fill="#00000000"
          tickFormatter={(date) =>
            date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" })
          }
          className="[&>rect:first-of-type]:hidden [&>.recharts-surface]:overflow-visible [&>.recharts-brush-texts>text]:fill-temperature overflow-visible"
          >
          <ComposedChart>
            <Bar dataKey="lowhigh" fill="oklch(55.4% 0.046 257.417)" />
            {showMaxTemp && <Scatter dataKey="max" fill={chartConfig.max.color} shape='cross' />}
            {showMinTemp && <Scatter dataKey="min" fill={chartConfig.min.color} shape="cross"/>}
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
