import { useCallback, useRef, useState } from 'react'
import { Config, Level, Log } from '../types'
import { getLogLevel } from '../lib/utils'
import { createGapEntries, getLevelPriority } from './utils/chartDataUtils'

const ONE_MINUTE_MS = 60 * 1000
const DEFAULT_CHART_WINDOW = 1 * ONE_MINUTE_MS

export type ChartData = { date: string; count: number; level: Level }

export const useChartData = (config: Config) => {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const chartRef = useRef<Record<string, Array<Log>>>({})
  const currentChartRef = useRef<ChartData>()
  const configRef = useRef<Config>(config)
  configRef.current = config

  const handleNewTimeWindow = useCallback((now: number, chartWindow: number, value: Log) => {
    const current = currentChartRef.current

    if (current) {
      const gap = now - new Date(current.date).getTime()
      const gapCount = Math.floor(gap / chartWindow)

      setChartData((previous) => [...previous, current, ...createGapEntries(current.date, gapCount, chartWindow)])
    }

    const level = getLogLevel(value, configRef.current)
    const date = new Date(now).toISOString()

    currentChartRef.current = { date, count: 1, level }
    chartRef.current[date] = [value]
  }, [])

  const updateExistingTimeWindow = useCallback((value: Log) => {
    if (!currentChartRef.current) {
      return
    }

    const level = getLogLevel(value, configRef.current)

    currentChartRef.current.count += 1

    const currentDate = currentChartRef.current.date
    if (!chartRef.current[currentDate]) {
      chartRef.current[currentDate] = []
    }
    chartRef.current[currentDate].push(value)

    // Update level based on priority (error > warn > info)

    const currentLevel = currentChartRef.current.level
    if (getLevelPriority(level) < getLevelPriority(currentLevel)) {
      currentChartRef.current.level = level
    }
  }, [])

  const updateChartData = useCallback(
    (value: Log) => {
      const now = Date.now()
      const chartWindow = (configRef.current.chartWindowMinute ?? DEFAULT_CHART_WINDOW) * ONE_MINUTE_MS

      if (!currentChartRef.current) {
        return handleNewTimeWindow(now, chartWindow, value)
      }

      const currentRefDate = new Date(currentChartRef.current.date)

      if (currentRefDate.getTime() < now - chartWindow) {
        handleNewTimeWindow(now, chartWindow, value)
      } else {
        updateExistingTimeWindow(value)
      }
    },
    [handleNewTimeWindow, updateExistingTimeWindow],
  )

  const clearChartData = useCallback(() => {
    setChartData([])
    chartRef.current = {}
    currentChartRef.current = undefined
  }, [])

  const onChartTickClick = useCallback(
    (data: ChartData) => {
      const date = new Date(data.date)
      const logs = chartRef.current[data.date] ?? null
      const title = `Logs of span ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`

      return { logs, title }
    },
    [chartRef],
  )

  return {
    chartData,
    updateChartData,
    clearChartData,
    onChartTickClick,
  }
}
