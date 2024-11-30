import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Button } from './ui/button'

export const description = 'An interactive bar chart'

const chartConfig = {
  views: { label: 'Logs count' },
} satisfies ChartConfig

type Props = {
  chartData: { date: string; count: number }[]
  count: number
  onClear: () => void
}

export const LogsChart: React.FC<Props> = ({ count, chartData, onClear }) => {
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
              <Bar dataKey="count" fill={`hsl(var(--chart-1))`} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  )
}