import { useCallback, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { Config, Level } from '../types'
import { getLogLevel } from '../lib/utils'
import { get } from 'lodash'

const socket = io('/')
const oneMinute = 60 * 1000
const defaultChartWindow = 1 * oneMinute // one minute

type ChartData = { date: string; count: number; level: Level }

export const useLogs = ({ config }: { config: Config }) => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [logs, setLogs] = useState<Record<string, unknown>[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const chartRef = useRef({} as Record<string, Array<Record<string, unknown>>>)
  const [selectedLog, setSelectedLog] = useState<Record<string, unknown> | null>(null)
  const [selectedLogs, setSelectedLogs] = useState<Array<Record<string, unknown>> | null>(null)
  const [selectedLogsTitle, setSelectedLogsTitle] = useState<string>('Trace view')

  const currentChartRef = useRef<ChartData>({
    date: new Date().toISOString(),
    count: 0,
    level: 'info',
  })
  const configRef = useRef<Config>(config)
  const logsRef = useRef(logs)

  logsRef.current = logs
  configRef.current = config

  const clearLogs = () => {
    setLogs([])
    setChartData([])
  }

  const onChartClick = useCallback((data: ChartData) => {
    setSelectedLogs(chartRef.current[data.date] ?? null)
    const date = new Date(data.date)
    setSelectedLogsTitle(`Logs of span ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`)
  }, [])

  const onTraceOpen = useCallback((log: Record<string, unknown>) => {
    setSelectedLog(null)

    const traceColumn = configRef.current.traceColumn

    if (traceColumn) {
      const trace = get(log, traceColumn)
      setSelectedLogs(logsRef.current.filter((row) => trace === get(row, traceColumn)))
      setSelectedLogsTitle(`Trace view ${trace}`)
    }
  }, [])

  const onTraceClose = useCallback(() => {
    setSelectedLogs(null)
    setSelectedLog(null)
  }, [])

  const onSelectLog = useCallback((log: Record<string, unknown> | null) => {
    setSelectedLogs(null)
    setSelectedLog(log)
  }, [])

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    function onLog(value: Record<string, unknown>) {
      setLogs((previous) => [...previous, value])

      const now = Date.now()
      const currentRefDate = new Date(currentChartRef.current.date)
      const chartWindow = configRef.current.chartWindowMinute
        ? configRef.current.chartWindowMinute * oneMinute
        : defaultChartWindow
      const level = getLogLevel(value, configRef.current).toLowerCase() as Level

      if (currentRefDate.getTime() < now - chartWindow) {
        const gap = now - currentRefDate.getTime()
        const gapCount = Math.floor(gap / chartWindow)
        const current = currentChartRef.current

        setChartData((previous): ChartData[] => {
          const gapList = Array.from({ length: gapCount - 1 }, (_, index): ChartData => {
            const date = new Date(current.date)
            date.setMilliseconds(date.getMilliseconds() + (index + 1) * chartWindow)

            return { date: date.toISOString(), count: 0, level: 'info' }
          })

          return [...previous, current, ...gapList]
        })

        currentChartRef.current = {
          date: new Date(now).toISOString(),
          count: 1,
          level,
        }
        chartRef.current[currentChartRef.current.date] = [value]
      } else {
        currentChartRef.current.count += 1
        chartRef.current[currentChartRef.current.date]?.push(value)

        if (level === 'error') {
          currentChartRef.current.level = 'error'
        } else if (level === 'warn' && currentChartRef.current.level !== 'error') {
          currentChartRef.current.level = 'warn'
        }
      }
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('log', onLog)
    socket.on('reset', () => clearLogs)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('log', onLog)
    }
  }, [])

  return {
    isConnected,
    logs,
    chartData,
    selectedLog,
    selectedLogs,
    selectedLogsTitle,

    clearLogs,
    onTraceOpen,
    onTraceClose,
    onSelectLog,
    setSelectedLog,
    onChartClick,
  }
}
