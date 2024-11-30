import { Card } from '@/components/ui/card'
import { useState } from 'react'
import { Details } from './Details'
import { Drawer } from './Drawer'
import { Logs } from './Logs'
import { LogsChart } from './components/LogsChart'
import { useGetConfig } from './hooks/useGetConfig'
import { useSocket } from './hooks/useSocket'

function App() {
  const config = useGetConfig()
  const { logs, chartData, clearLogs } = useSocket({ config })
  const [selectedLog, setSelectedLog] = useState<Record<string, unknown> | null>(null)
  const [trace, setTrace] = useState<Array<Record<string, unknown>> | null>(null)
  const onTraceOpen = (log: Record<string, unknown>) => {
    setSelectedLog(null)
    setTrace(logs.filter(({ reqId }) => reqId === log.reqId))
  }

  const onCloseTrace = () => {
    setTrace(null)
    setSelectedLog(null)
  }

  const onSelectLog = (log: Record<string, unknown>) => {
    setTrace(null)
    setSelectedLog(log)
  }

  return (
    <>
      <LogsChart onClear={clearLogs} chartData={chartData} count={logs.length} />
      <Card>
        <Logs
          config={config}
          logs={logs}
          columns={config.gridColumns}
          onRowClick={onSelectLog}
          traceColumn={config.traceColumn}
          onTraceOpen={onTraceOpen}
        />
      </Card>
      <Drawer isOpen={!!trace} onCancel={onCloseTrace} title="Trace view" isStacked={!!selectedLog}>
        <Logs config={config} logs={trace ?? []} columns={config.gridColumns} onRowClick={setSelectedLog} />
      </Drawer>
      <Drawer isOpen={!!selectedLog} onCancel={() => setSelectedLog(null)} title="Log view">
        {selectedLog && <Details log={selectedLog} columns={config.detailColumns} config={config} />}
      </Drawer>
    </>
  )
}

export default App
