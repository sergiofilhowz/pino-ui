import { get } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { Config, Log } from '../types'
import { ChartData, useChartData } from './useChartData'

const socket = io('/')

export const useLogs = ({ config }: { config: Config }) => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [logs, setLogs] = useState<Log[]>([])
  const [selectedLog, setSelectedLog] = useState<Log | null>(null)
  const [selectedLogs, setSelectedLogs] = useState<Array<Log> | null>(null)
  const [selectedLogsTitle, setSelectedLogsTitle] = useState<string>('Trace view')

  const configRef = useRef<Config>(config)
  const logsRef = useRef(logs)

  const { chartData, onChartTickClick, updateChartData, clearChartData } = useChartData(config)

  logsRef.current = logs
  configRef.current = config

  const clearLogs = () => {
    setLogs([])
    clearChartData()
  }

  const onTraceOpen = useCallback((log: Log) => {
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

  const onSelectLog = useCallback((log: Log | null) => {
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

    function onLog(value: Log) {
      setLogs((previous) => [...previous, value])
      updateChartData(value)
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
  }, [updateChartData])

  const onChartClick = useCallback(
    (data: ChartData) => {
      const { logs, title } = onChartTickClick(data)
      setSelectedLogs(logs)
      setSelectedLogsTitle(title)
    },
    [onChartTickClick],
  )

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
