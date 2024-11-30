import styled from 'styled-components'
import { textStyles } from './styles/fontStyles'
import { Column, Config } from './types'
import ReactJson from 'react18-json-view'
import { get } from 'lodash'
import 'react18-json-view/src/style.css'
import 'react18-json-view/src/dark.css'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { colors } from './styles/colors'
import { useGetLogDetails } from './hooks/useGetLogDetails'

type Props = {
  log: Record<string, unknown>
  columns: Column[]
  config: Config
}

export const Details: React.FC<Props> = ({ log, columns, config }) => {
  const { timestamp, level, message } = useGetLogDetails(log, config)

  return (
    <Container>
      <Card>
        <CardHeader>
          <CardTitle>Log details</CardTitle>
        </CardHeader>
        <CardContent>
          <Detail>
            <DetailLabel>Timestamp</DetailLabel>
            <DetailValue>{timestamp}</DetailValue>
          </Detail>
          <Detail>
            <DetailLabel>Level</DetailLabel>
            <DetailValue>
              <Badge variant={log.level === 'ERROR' ? 'destructive' : 'default'}>{level}</Badge>
            </DetailValue>
          </Detail>
          <Detail>
            <DetailLabel>Message</DetailLabel>
            <DetailValue>{message}</DetailValue>
          </Detail>
          {columns
            .filter(({ key }) => !!get(log, key))
            .map(({ name, key, formatter }) => (
              <Detail key={key}>
                <DetailLabel>{name}</DetailLabel>
                <DetailValue>
                  {formatter === 'json' ? (
                    <ReactJson src={get(log, key) as any} dark />
                  ) : formatter === 'code' ? (
                    <Code>{get(log, key) as string}</Code>
                  ) : (
                    (get(log, key) as string)
                  )}
                </DetailValue>
              </Detail>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>JSON Blob</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailValue>
            <ReactJson src={log} dark />
          </DetailValue>
        </CardContent>
      </Card>
    </Container>
  )
}

const Container = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Detail = styled.div`
  display: flex;
  padding: 8px;
  border-radius: 8px;

  &:nth-child(even) {
    background: rgba(222, 224, 228, 0.07);
  }
`

const DetailLabel = styled.div`
  ${textStyles.label.sm}
  flex: 1;
`

const DetailValue = styled.div`
  ${textStyles.body.sm}
  flex: 2;
`

const Code = styled.div`
  ${textStyles.code.sm}
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${colors.background.code};
`
