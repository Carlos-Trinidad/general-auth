import { t } from 'elysia'

export const HealthzModels = {
    liveResponse: t.Object({
        status: t.String()
    }),
    readyResponse: t.Object({
        status: t.String(),
        checks: t.Record(t.String(), t.String())
    })
}

// Type inference from models
export type LiveResponse = typeof HealthzModels.liveResponse.static
export type ReadyResponse = typeof HealthzModels.readyResponse.static
