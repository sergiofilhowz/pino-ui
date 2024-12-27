import React, { memo, MouseEvent } from 'react'
import get from 'lodash/get'
import { SquareArrowOutUpRightIcon } from 'lucide-react'
import { TableCell, TableRow } from './components/ui/table'
import { Button } from './components/ui/button'
import { Config, Log } from './types'
import { useGetLogDetails } from './hooks/useGetLogDetails'
import { LogMessage } from './components/ui/logMessage'
import { LogLevel } from './components/LogLevel'

type Props = {
  onRowClick: (record: Log) => void
  log: Log
  columns: string[]
  config: Config

  onTraceOpen?: (record: Log) => void
  traceColumn?: string
}

export const LogLine: React.FC<Props> = memo((props) => {
  const { log, columns, onRowClick, traceColumn, onTraceOpen, config } = props
  const { timestamp, level } = useGetLogDetails(log, config)
  const onTraceClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation()
    evt.preventDefault()
    onTraceOpen?.(log)
  }

  return (
    <TableRow onClick={() => onRowClick(log)}>
      <TableCell>
        <LogMessage variant="center">{timestamp}</LogMessage>
      </TableCell>
      <TableCell>
        <LogMessage variant="center">
          <LogLevel level={level} />
        </LogMessage>
      </TableCell>
      {columns.map((column) => (
        <TableCell key={column}>
          <div className="flex items-center flex-nowrap">
            <Message log={log} column={column} />
            {traceColumn === column && onTraceOpen && (
              <div className="flex grow justify-start">
                <Button variant="secondary" size="xs" className="ml-2" onClick={onTraceClick}>
                  <SquareArrowOutUpRightIcon size={18} />
                </Button>
              </div>
            )}
          </div>
        </TableCell>
      ))}
    </TableRow>
  )
})

type MessageProps = { log: Log; column: string }

const isUuid = (value?: string) => {
  return value?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
}

const Message: React.FC<MessageProps> = ({ log, column }) => {
  const field = get(log, column)
  const text = typeof field === 'string' ? field : JSON.stringify(field)

  if (isUuid(text)) {
    return <LogMessage variant="code">uuid:{text.slice(24, 36)}</LogMessage>
  }

  return <LogMessage>{text}</LogMessage>
}
