import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Config } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const upper = (str: string | unknown) => (typeof str === 'string' ? str?.toUpperCase() : String(str))

export const getLogLevel = (log: Record<string, unknown>, config: Config) => {
  const level = log[config.levelColumn ?? 'level'] as string
  const levelColumn = config.levelMapping?.[String(level)] ?? level
  return upper(levelColumn)
}

export const getLog = (log: Record<string, unknown>, config: Config) => {
  const timestampColumn = log[config.timestampColumn ?? 'time']
  const level = getLogLevel(log, config)

  const date = new Date(Number(timestampColumn))
  const timestamp = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  const message = log[config.messageColumn ?? 'msg']

  return { level, timestamp, message }
}
