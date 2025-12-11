import { Elysia } from 'elysia'

import { config, EnvironmentVariables } from '@api/config'
import { healthz } from '@api/modules'
import { Utils } from '@api/utils'

export const app = new Elysia({ name: 'app' })
    .use(config)
    .use(healthz)
    .onStop(Utils.gracefulShutdown)
    .listen(EnvironmentVariables.PORT)

process.on('exit', app.stop)

export type app = typeof app

console.log(
    `🔐 Auth Server is running at ${app.server?.hostname}:${app.server?.port}`
)
