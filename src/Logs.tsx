import React, { memo, ReactNode, useCallback, useMemo } from 'react'
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

export const Logs: React.FC<Props> = memo((props) => {
  const { logs, columns, onRowClick, traceColumn, onTraceOpen, config } = props
  const columnKeys = useMemo(() => columns.map(({ key }) => key), [columns])

  const map = useCallback(
    (list: Array<any>, callback: (item: any, index: number) => ReactNode): ReactNode[] => {
      if (config.ascending) {
        return list.map(callback)
      }

      const result = []

      for (let i = list.length - 1; i >= 0; i--) {
        result.push(callback(list[i], i))
      }

      return result
    },
    [config.ascending, logs],
  )

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
        {map(logs, (logLine, index) => (
          <LogLine
            config={config}
            onRowClick={onRowClick}
            columns={columnKeys}
            key={index}
            log={logLine}
            traceColumn={traceColumn}
            onTraceOpen={onTraceOpen}
          />
        ))}
      </TableBody>
    </Table>
  )
})
