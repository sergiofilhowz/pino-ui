import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'
import { createServer as createViteServer } from 'vite'
import { faker } from '@faker-js/faker'

const __filename = fileURLToPath(import.meta.url)
const app = express()
const server = http.createServer(app)
const io = new Server(server)
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
})

const createLog = (log) => io.emit('log', log)

app.get('/seed', (req, res) => {
  const quantity = req.query.quantity ? parseInt(req.query.quantity) : faker.number.int(10, 150)
  const date = Date.now()

  for (let i = 0; i < quantity; i++) {
    createLog({
      timestamp: date - (quantity - i) * 1000,
      level: faker.helpers.weightedArrayElement([
        { weight: 80, value: 30 },
        { weight: 20, value: 40 },
        { weight: 5, value: 50 },
        { weight: 2, value: 60 },
      ]),
      message: faker.hacker.phrase(),
      service: faker.helpers.arrayElement(['Default', 'Auth', 'GraphQL', 'Postgres', 'Redis']),
      pid: 50023,
      reqId: `req-${i}`,
      service: 'Default',
      context: {
        requestPath: '/graphql',
        userId: faker.string.uuid(),
        sourceIp: faker.internet.ip(),
        referer: faker.internet.url(),
        userAgent: faker.internet.userAgent(),
      },
    })
  }

  res.end()
})

app.get('/new-log', (req, res) => {
  const level = (req.query.level = req.query.level || 30)
  const service = req.query.service || 'Default'

  createLog({
    level: level,
    timestamp: String(Date.now()),
    pid: 50023,
    hostname: 'mac.local',
    reqId: 'req-3',
    service,
    context: {
      requestPath: '/graphql',
      userId: faker.string.uuid(),
      sourceIp: faker.internet.ip(),
      referer: faker.internet.url(),
      userAgent: faker.internet.userAgent(),
    },
    sql: 'select * from users where id = $1',
    parameters: ['a332288a-9a13-464f-aa3a-8e4b5ff8b336'],
    environment: 'staging',
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
      { name: 'Service', key: 'service' },
    ],
    detailColumns: [
      { name: 'Req #', key: 'reqId' },
      { name: 'User', key: 'context.userId', formatter: 'code' },
      { name: 'SQL', key: 'sql', formatter: 'code' },
      { name: 'Parameters', key: 'parameters', formatter: 'json' },
    ],
    traceColumn: 'reqId',
    levelColumn: 'level',
    timestampColumn: 'timestamp',
    messageColumn: 'message',
    levelMapping: {
      30: 'INFO',
      40: 'WARN',
      50: 'ERROR',
      60: 'FATAL',
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
