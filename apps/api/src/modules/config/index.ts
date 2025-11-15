import Elysia from 'elysia'

import { environment, EnvironmentVariables } from './environment'
import { helmet } from './helmet'
import { logger } from './logger'
import { openapi } from './openapi'
import { otel } from './otel'
import { cors } from './cors'
import { xss } from './xss'

const config = new Elysia({ name: 'config' })
    .use(environment)
    .use(helmet)
    .use(logger)
    .use(openapi)
    .use(otel)
    .use(cors)
    .use(xss)

export { config, EnvironmentVariables }
