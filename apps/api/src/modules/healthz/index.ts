import { Elysia } from 'elysia'
import { HealthzChecks } from '@api/modules/healthz/service'
import { HealthzModels } from '@api/modules/healthz/model'

export const healthz = new Elysia({ name: 'healthz', prefix: '/healthz' })
    .model({
        'healthz.live': HealthzModels.liveResponse,
        'healthz.ready': HealthzModels.readyResponse
    })
    .get('/live', () => ({ status: 'up' as const }), {
        response: {
            200: 'healthz.live'
        }
    })
    .get(
        '/ready',
        async ({ status }) => {
            const checks = await HealthzChecks.perform()
            const isReady = Object.values(checks).every(
                (check) => check === 'up'
            )

            if (isReady) {
                return {
                    status: 'up' as const,
                    checks
                }
            }

            return status(503, {
                status: 'down' as const,
                checks
            })
        },
        {
            response: {
                200: 'healthz.ready',
                503: 'healthz.ready'
            }
        }
    )
