import { Elysia } from 'elysia'

import { config, EnvironmentVariables } from '@api/modules/config'

export const app = new Elysia({ name: 'app' })
    .use(config)
    .get('/', () => 'Hello Worl')
    .listen(EnvironmentVariables.PORT)

process.on('beforeExit', app.stop)
process.on('SIGINT', app.stop)
process.on('SIGTERM', app.stop)

export type app = typeof app

console.log(
    `🔐 Auth Server is running at ${app.server?.hostname}:${app.server?.port}`
)
