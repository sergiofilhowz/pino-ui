import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { Config } from '../types'

const socket = io('/')
const oneMinute = 60 * 1000
const defaultChartWindow = 1 * oneMinute // one minute

export const useSocket = ({ config }: { config: Config }) => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [logs, setLogs] = useState<Record<string, unknown>[]>([])
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>([])
  const currentChartRef = useRef({ date: new Date().toISOString(), count: 0 })
  const configRef = useRef<Config>(config)
  const clearLogs = () => {
    setLogs([])
    setChartData([])
  }

  useEffect(() => {
    configRef.current = config
  }, [config])

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    function onLog(value: Record<string, unknown>) {
      setLogs((previous) => (configRef.current.ascending ? [...previous, value] : [value, ...previous]))

      const now = Date.now()
      const currentRefDate = new Date(currentChartRef.current.date)
      const chartWindow = configRef.current.chartWindowMinute
        ? configRef.current.chartWindowMinute * oneMinute
        : defaultChartWindow

      if (currentRefDate.getTime() < now - chartWindow) {
        const gap = now - currentRefDate.getTime()
        const gapCount = Math.floor(gap / chartWindow)
        const current = currentChartRef.current

        setChartData((previous) => {
          const gapList = Array.from({ length: gapCount - 1 }, (_, index) => {
            const date = new Date(current.date)
            date.setMilliseconds(date.getMilliseconds() + (index + 1) * chartWindow)
            return { date: date.toISOString(), count: 0 }
          })

          return [...previous, current, ...gapList]
        })

        currentChartRef.current = {
          date: new Date(now).toISOString(),
          count: 1,
        }
      } else {
        currentChartRef.current.count += 1
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

  return { isConnected, logs, chartData, clearLogs }
}
