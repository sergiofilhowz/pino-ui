import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Config } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const upper = (str: string | unknown) => (typeof str === 'string' ? str?.toUpperCase() : str)

export const getLog = (log: Record<string, unknown>, config: Config) => {
  const getLogLevel = (level: string | number) => config.levelMapping?.[String(level)] ?? level
  const timestampColumn = log[config.timestampColumn ?? 'time']
  const levelColumn = getLogLevel(log[config.levelColumn ?? 'level'] as string)
  const level = upper(levelColumn)

  const date = new Date(Number(timestampColumn))
  const timestamp = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  const message = log[config.messageColumn ?? 'msg']

  return { level, timestamp, message }
}
