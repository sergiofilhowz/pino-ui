export type Column = {
  name: string
  key: string
  formatter?: 'text' | 'multiline_text' | 'numeric' | 'code' | 'sql' | 'json' | 'uuid' | 'duration' | 'timestamp'
}

export type Log = Record<string, unknown>
export type Level = 'ERROR' | 'WARN' | 'INFO' | 'FATAL' | 'DEBUG' | 'TRACE'

export type Config = {
  gridColumns: Column[]
  detailColumns: Column[]
  autoReset?: boolean
  ascending?: boolean
  chartWindowMinute?: number

  levelColumn?: string // level
  traceColumn?: string
  messageColumn?: string // msg
  timestampColumn?: string // time
  levelMapping?: { [key: string]: string }
}
