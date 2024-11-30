import React, { MouseEvent } from 'react'
import styled from 'styled-components'
import { textStyles } from './styles/fontStyles'
import { colors } from './styles/colors'
import get from 'lodash/get'
import { OpenIcon } from './OpenIcon'
import { Badge } from './components/ui/badge'
import { TableCell, TableRow } from './components/ui/table'
import { Button } from './components/ui/button'
import { Config } from './types'
import { useGetLogDetails } from './hooks/useGetLogDetails'

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
        <CenteredLogMessage>{timestamp}</CenteredLogMessage>
      </TableCell>
      <TableCell>
        <CenteredLogMessage>
          <Badge variant={level === 'ERROR' ? 'destructive' : 'default'}>{level}</Badge>
        </CenteredLogMessage>
      </TableCell>
      {columns.map((column) => (
        <TableCell key={column}>
          <ColumnContainer>
            <Message log={log} column={column} />
            {traceColumn === column && onTraceOpen && (
              <ButtonContainer>
                <Button variant="secondary" size="xs" className="ml-2" onClick={onTraceClick}>
                  <OpenIcon size={18} />
                </Button>
              </ButtonContainer>
            )}
          </ColumnContainer>
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
    return <LogCode>uuid:{text.slice(24, 36)}</LogCode>
  }

  return <LogMessage>{text}</LogMessage>
}

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
`

const LogMessage = styled.div`
  ${textStyles.body.md}
  line-height: 28px;
  flex: 1;
  white-space: nowrap;
  text-align: left;
`

const CenteredLogMessage = styled(LogMessage)`
  text-align: center;
`

const LogCode = styled.code`
  ${textStyles.code.sm}
  background: ${colors.background.code};
  padding: 4px 8px;
  border-radius: 4px;
`

const ButtonContainer = styled.div`
  display: flex;
  flex: 2;
  justify-content: flex-start;
  flex-direction: row;
`
