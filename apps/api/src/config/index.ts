import Elysia from 'elysia'

import { environment, EnvironmentVariables } from './environment'
import { helmet } from './helmet'
import { logger } from './logger'
import { openapi } from './openapi'
import { otel } from './otel'
import { cors } from './cors'

const config = new Elysia({ name: 'config' })
    .use(environment)
    .use(helmet)
    .use(logger)
    .use(openapi)
    .use(otel)
    .use(cors)

export { config, EnvironmentVariables }
