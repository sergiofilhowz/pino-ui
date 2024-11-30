import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'
import { createServer as createViteServer } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const app = express()
const server = http.createServer(app)
const io = new Server(server)
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
})

app.get('/new-log', (req, res) => {
  io.emit('log', {
    level: 30,
    timestamp: String(Date.now()),
    pid: 50023,
    hostname: 'mac.local',
    reqId: 'req-3',
    context: {
      requestPath: '/graphql',
      userId: 'a332288a-9a13-464f-aa3a-8e4b5ff8b336',
      sourceIp: '::1',
      referer: 'http://localhost:5173/',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      buildNumber: -1,
      isEmulator: false,
      apiRequestId: 'req-3',
    },
    sql: 'select * from users where id = $1',
    parameters: ['a332288a-9a13-464f-aa3a-8e4b5ff8b336'],
    environment: 'staging',
    graphqlOperationName: 'authenticateWithProvider',
    graphqlFieldName: 'Mutation.authenticateWithProvider',
    message: 'New postgres dialect connection',
  })
  res.end()
})

app.get('/config.json', (_, res) => {
  res.status(200).json({
    gridColumns: [
      { name: 'Req #', key: 'reqId' },
      { name: 'User', key: 'context.userId' },
      { name: 'Message', key: 'message' },
      { name: 'GraphQL Field', key: 'graphqlFieldName' },
    ],
    detailColumns: [
      { name: 'Req #', key: 'reqId' },
      { name: 'User', key: 'context.userId', formatter: 'code' },
      { name: 'GraphQL Field', key: 'graphqlFieldName', formatter: 'code' },
      { name: 'SQL', key: 'sql', formatter: 'code' },
      { name: 'Parameters', key: 'parameters', formatter: 'json' },
    ],
    traceColumn: 'reqId',
    levelColumn: 'level',
    timestampColumn: 'timestamp',
    messageColumn: 'message',
    levelMapping: {
      30: 'INFO',
      100: 'WARN',
      400: 'ERROR',
    },
  })
})

app.use(vite.middlewares)
app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  try {
    const index = fs.readFileSync(path.resolve(path.dirname(__filename), 'index.html'), 'utf-8')
    const html = await vite.transformIndexHtml(url, index)

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    next(e)
  }
})

server.listen(3002)

console.log('Server started at port 3002')
