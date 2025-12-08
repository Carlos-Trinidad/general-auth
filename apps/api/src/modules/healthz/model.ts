import { t } from 'elysia'

const HealthzStatusResponse = t.Union([t.Literal('up'), t.Literal('down')])
const HealthzChecksResponse = t.Record(
    t.Union([t.Literal('application'), t.Literal('database')]),
    HealthzStatusResponse
)

export const HealthzModels = {
    liveResponse: t.Object({
        status: HealthzStatusResponse
    }),
    readyResponse: t.Object({
        status: HealthzStatusResponse,
        checks: HealthzChecksResponse
    })
}

// Type inference from models
export type LiveResponse = typeof HealthzModels.liveResponse.static
export type ReadyResponse = typeof HealthzModels.readyResponse.static

export type HealthzStatusResponse = typeof HealthzStatusResponse.static
export type HealthzChecksResponse = typeof HealthzChecksResponse.static
