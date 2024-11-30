import React, { MouseEvent } from 'react'
import get from 'lodash/get'
import { SquareArrowOutUpRightIcon } from 'lucide-react'
import { Badge } from './components/ui/badge'
import { TableCell, TableRow } from './components/ui/table'
import { Button } from './components/ui/button'
import { Config } from './types'
import { useGetLogDetails } from './hooks/useGetLogDetails'
import { LogMessage } from './components/ui/logMessage'

type Props = {
  onRowClick: () => void
  log: Record<string, unknown>
  columns: string[]
  config: Config

  onTraceOpen?: (record: Record<string, unknown>) => void
  traceColumn?: string
}

export const LogLine: React.FC<Props> = (props) => {
  const { log, columns, onRowClick, traceColumn, onTraceOpen, config } = props
  const { timestamp, level } = useGetLogDetails(log, config)
  const onTraceClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation()
    evt.preventDefault()
    onTraceOpen?.(log)
  }

  return (
    <TableRow onClick={onRowClick}>
      <TableCell>
        <LogMessage variant="center">{timestamp}</LogMessage>
      </TableCell>
      <TableCell>
        <LogMessage variant="center">
          <Badge variant={level === 'ERROR' ? 'destructive' : 'default'}>{level}</Badge>
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
}

type MessageProps = { log: Record<string, unknown>; column: string }

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
