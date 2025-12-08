import { Value } from '@sinclair/typebox/value'
import { Elysia, t } from 'elysia'

const environmentVariables = t.Object({
    NODE_ENV: t.Union([
        t.Literal('test'),
        t.Literal('local'),
        t.Literal('development'),
        t.Literal('production')
    ]),
    ORIGIN: t.String(),
    PORT: t.Numeric(),
    LOG_LEVEL: t.Union([
        t.Literal('fatal'),
        t.Literal('error'),
        t.Literal('warn'),
        t.Literal('info'),
        t.Literal('debug'),
        t.Literal('trace'),
        t.Literal('silent')
    ]),
    CORRELATION_ID: t.Optional(t.String({ default: 'X-Request-ID' }))
})

export const EnvironmentVariables = Value.Parse(
    environmentVariables,
    process.env
)

export const environment = new Elysia({ name: 'environment' }).env(
    environmentVariables
)
