import { get } from 'lodash'
import ReactJson from 'react18-json-view'
import 'react18-json-view/src/dark.css'
import 'react18-json-view/src/style.css'
import { LogLevel } from './components/LogLevel'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { useGetLogDetails } from './hooks/useGetLogDetails'
import { Column, Config, Log } from './types'

type Props = {
  log: Log
  columns: Column[]
  config: Config
}

const classes = {
  body: 'flex flex-col p-1 gap-1 flex-1',
  detail: 'flex items-center p-2 rounded-md even:bg-zinc-900',
  detailLabel: 'w-3/12 font-bold',
  detailValue: 'flex-1 font-bold',
  code: 'flex-1 font-mono text-sm font-bold px-2 py-1 bg-zinc-800 inline-block rounded-md',
}

export const Details: React.FC<Props> = ({ log, columns, config }) => {
  const { timestamp, level, message } = useGetLogDetails(log, config)

  return (
    <div className={classes.body}>
      <Card>
        <CardHeader>
          <CardTitle>Log details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={classes.detail}>
            <div className={classes.detailLabel}>Timestamp</div>
            <div className={classes.detailValue}>{timestamp}</div>
          </div>
          <div className={classes.detail}>
            <div className={classes.detailLabel}>Level</div>
            <div className={classes.detailValue}>
              <LogLevel level={level} />
            </div>
          </div>
          <div className={classes.detail}>
            <div className={classes.detailLabel}>Message</div>
            <div className={classes.detailValue}>{message}</div>
          </div>
          {columns
            .filter(({ key }) => !!get(log, key))
            .map(({ name, key, formatter }) => (
              <div className={classes.detail} key={key}>
                <div className={classes.detailLabel}>{name}</div>
                <div className={classes.detailValue}>
                  {formatter === 'json' ? (
                    <ReactJson src={get(log, key) as any} dark />
                  ) : formatter === 'code' ? (
                    <div className={classes.code}>{get(log, key) as string}</div>
                  ) : (
                    (get(log, key) as string)
                  )}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>JSON Blob</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={classes.detailValue}>
            <ReactJson src={log} dark />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
