import { useMemo } from 'react'
import { Config, Log } from '../types'

const upper = (str: string | unknown): string => {
  return typeof str === 'string' ? str?.toUpperCase() : String(str)
}

type HookResult = {
  level: string
  timestamp: string
  message: string
}

export const useGetLogDetails = (log: Log, config: Config): HookResult => {
  const { level, timestamp, message } = useMemo(() => {
    const getLogLevel = (level: string | number) => config.levelMapping?.[String(level)] ?? level
    const timestampColumn = log[config.timestampColumn ?? 'time']
    const levelColumn = getLogLevel(log[config.levelColumn ?? 'level'] as string)
    const level = upper(levelColumn)
    const date = new Date(Number(timestampColumn))
    const timestamp = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    const message = log[config.messageColumn ?? 'msg'] as string

    return { level, timestamp, message }
  }, [log, config])

  return { level, timestamp, message }
}
