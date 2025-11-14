import { Value } from '@sinclair/typebox/value'
import { Elysia, t } from 'elysia'

const environmentVariables = t.Object({
    NODE_ENV: t.Union([t.Literal('development'), t.Literal('production')]),
    ORIGIN: t.String(),
    PORT: t.Numeric()
})

export const EnvironmentVariables = Value.Parse(
    environmentVariables,
    process.env
)

export const environment = new Elysia({ name: 'environment' }).env(
    environmentVariables
)
