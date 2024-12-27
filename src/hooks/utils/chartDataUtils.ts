import { Level } from '../../types'
import type { ChartData } from '../useChartData'

export function createGapEntries(startDate: string, count: number, chartWindow: number): ChartData[] {
  return Array.from(
    { length: count - 1 },
    (_, index): ChartData => ({
      date: new Date(new Date(startDate).getTime() + (index + 1) * chartWindow).toISOString(),
      count: 0,
      level: 'INFO',
    }),
  )
}

const LEVEL_PRIORITY: Record<Level, number> = { FATAL: 1, ERROR: 2, WARN: 3, INFO: 4, DEBUG: 5, TRACE: 6 }

export function getLevelPriority(level: Level): number {
  return LEVEL_PRIORITY[level]
}
