import { Elysia } from 'elysia'

import { config, EnvironmentVariables } from '@api/modules/config'

export const app = new Elysia({ name: 'app' })
    .use(config)
    .get('/ping', () => 'pong')
    .listen(EnvironmentVariables.PORT)

process.on('exit', app.stop)

export type app = typeof app

console.log(
    `🔐 Auth Server is running at ${app.server?.hostname}:${app.server?.port}`
)
