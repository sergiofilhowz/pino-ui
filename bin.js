#!/usr/bin/env node

import fs from 'fs'
import pump from 'pump'
import build from 'pino-abstract-transport'
import { pipeline, Transform } from 'stream'
import express from 'express'
import serveStatic from 'serve-static'
import http from 'http'
import { Server } from 'socket.io'
import path from 'node:path'
import { fileURLToPath } from 'url'
import colors from 'colors'

const __filename = fileURLToPath(import.meta.url)
const app = express()
const server = http.createServer(app)
const io = new Server(server)

const config = fs.existsSync(path.join(process.cwd(), '.pino-ui.json'), 'utf8')
  ? JSON.parse(fs.readFileSync(path.join(process.cwd(), '.pino-ui.json'), 'utf8'))
  : defaultConfig
const timestampColumn = config.timestampColumn ?? 'time'
const levelColumn = config.levelColumn ?? 'level'
const messageColumn = config.messageColumn ?? 'msg'

const upper = (str) => (typeof str === 'string' ? str?.toUpperCase() : str)
const getLogLevel = (level) => config.levelMapping?.[String(level)] ?? level

function sendMessage(log) {
  const level = upper(getLogLevel(log[levelColumn]))
  const date = new Date(Number(log[timestampColumn]))
  const logLevel = level === 'ERROR' ? colors.red(level) : level === 'WARN' ? colors.yellow(level) : colors.cyan(level)
  const timestamp = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  const message = log[messageColumn]

  console.log(`${colors.gray(`[${timestamp} - ${logLevel}]`)} ${colors.green(message)}`)
  io.emit('log', log)
}

function create() {
  return build(
    function (source) {
      const myTransportStream = new Transform({
        autoDestroy: true,
        objectMode: true,
        transform(log, _, cb) {
          sendMessage(log)
          cb()
        },
      })
      pipeline(source, myTransportStream, () => {})
      return myTransportStream
      // This is needed to be able to pipeline transports.
    },
    { enablePipelining: true },
  )
}

const stream = create()

pump(process.stdin, stream)

const defaultConfig = {
  port: 8080,
  gridColumns: [],
  detailColumns: [],
  autoReset: false,
}

app.get('/config.json', (_, res) => res.status(200).json(config))
app.use(serveStatic(path.join(path.dirname(__filename), 'dist')))

const port = config.port ?? defaultConfig.port

server.listen(port)

sendMessage({
  [timestampColumn]: Date.now(),
  [levelColumn]: 'info',
  [messageColumn]: `Pino UI server started at port ${port}. Open \x1b]8;;http://localhost:${port}\x1b\\http://localhost:${port}\x1b]8;;\x1b\\`,
})

if (config.autoReset) {
  io.once('connection', () => io.emit('reset'))
}
