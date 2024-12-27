import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Eraser } from 'lucide-react'
import React from 'react'
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from 'recharts'
import { Button } from './ui/button'
import { Level } from '../types'

export const description = 'An interactive bar chart'

const chartConfig = {
  views: { label: 'Logs count' },
} satisfies ChartConfig

type ChartEntry = { date: string; count: number; level: Level }

type Props = {
  chartData: ChartEntry[]
  count: number
  onClear: () => void
  onChartClick: (data: ChartEntry) => void
}

const RED = '#f43f5e'
const YELLOW = '#eab308'
const BLUE = '#3b82f6'

const colors: Record<Level, string> = {
  FATAL: RED,
  ERROR: RED,
  WARN: YELLOW,
  INFO: BLUE,
  DEBUG: BLUE,
  TRACE: BLUE,
}

export const LogsChart: React.FC<Props> = ({ count, chartData, onClear, onChartClick }) => {
  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-row justify-center items-center gap-4">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Logs</CardTitle>
            <CardDescription>Showing total logs since beginning</CardDescription>
          </div>
          <Button onClick={onClear} className="w-full sm:w-auto">
            Clear
            <Eraser size={16} />
          </Button>
          <div className="flex">
            <button className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0">
              <span className="text-xs text-muted-foreground">Total Logs</span>
              <span className="text-lg font-bold leading-none sm:text-3xl">{count.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </CardHeader>
      {chartData.length > 0 && (
        <CardContent className="px-2 sm:p-1">
          <ChartContainer config={chartConfig} className="aspect-auto h-[100px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={false}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleTimeString('en-US')
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleTimeString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    }}
                  />
                }
              />
              <Bar dataKey="count" fill={colors.INFO}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={colors[entry.level] ?? colors.INFO} onClick={() => onChartClick(entry)} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  )
}
