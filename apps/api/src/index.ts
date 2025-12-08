import { Elysia } from 'elysia'

import { config, EnvironmentVariables } from '@api/config'
import { healthz } from './modules'
import { gracefulShutdown } from './utils'

export const app = new Elysia({ name: 'app' })
    .use(config)
    .use(healthz)
    .get('/ping', () => 'pong')
    .onStop(gracefulShutdown)
    .listen(EnvironmentVariables.PORT)

process.on('exit', app.stop)

export type app = typeof app

console.log(
    `🔐 Auth Server is running at ${app.server?.hostname}:${app.server?.port}`
)
