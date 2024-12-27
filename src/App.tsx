import { Card } from '@/components/ui/card'
import { Details } from './Details'
import { Drawer } from './Drawer'
import { Logs } from './Logs'
import { LogsChart } from './components/LogsChart'
import { useGetConfig } from './hooks/useGetConfig'
import { useLogs } from './hooks/useLogs'
import { useKeyPress } from './hooks/useKeyPress'

function App() {
  const config = useGetConfig()
  const {
    logs,
    selectedLog,
    selectedLogs,
    selectedLogsTitle,
    chartData,
    clearLogs,
    onTraceOpen,
    onTraceClose,
    onSelectLog,
    onChartClick,
    setSelectedLog,
  } = useLogs({ config })

  useKeyPress('Escape', onTraceClose, [])

  return (
    <>
      <LogsChart onClear={clearLogs} chartData={chartData} count={logs.length} onChartClick={onChartClick} />
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
      <Drawer isOpen={!!selectedLogs} onCancel={onTraceClose} title={selectedLogsTitle} isStacked={!!selectedLog}>
        <Logs config={config} logs={selectedLogs ?? []} columns={config.gridColumns} onRowClick={setSelectedLog} />
      </Drawer>
      <Drawer isOpen={!!selectedLog} onCancel={() => setSelectedLog(null)} title="Log view">
        {selectedLog && <Details log={selectedLog} columns={config.detailColumns} config={config} />}
      </Drawer>
    </>
  )
}

export default App
