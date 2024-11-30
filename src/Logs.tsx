import React from 'react'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LogLine } from './LogLine'
import { Column, Config } from './types'

type Props = {
  logs: Record<string, unknown>[]
  columns: Column[]
  onRowClick: (record: Record<string, unknown>) => void
  onTraceOpen?: (record: Record<string, unknown>) => void
  traceColumn?: string
  config: Config
}

export const Logs: React.FC<Props> = (props) => {
  const { logs, columns, onRowClick, traceColumn, onTraceOpen, config } = props

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Timestamp</TableHead>
          <TableHead className="text-center">Level</TableHead>
          {columns.map(({ name }) => (
            <TableHead className="text-left" key={name}>
              {name}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((logLine, index) => (
          <LogLine
            config={config}
            onRowClick={() => onRowClick(logLine)}
            columns={columns.map(({ key }) => key)}
            key={index}
            log={logLine}
            traceColumn={traceColumn}
            onTraceOpen={onTraceOpen}
          />
        ))}
      </TableBody>
    </Table>
  )
}
