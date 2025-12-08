import { Elysia } from 'elysia'
import { HealthzChecks } from '@api/modules/healthz/service'
import { HealthzModels } from '@api/modules/healthz/model'

export const healthz = new Elysia({ name: 'healthz', prefix: '/healthz' })
    .model({
        'healthz.live': HealthzModels.liveResponse,
        'healthz.ready': HealthzModels.readyResponse
    })
    .get('/live', () => ({ status: 'ok' }), {
        response: 'healthz.live'
    })
    .get(
        '/ready',
        async ({ status }) => {
            const checks = await HealthzChecks.perform()
            const isReady = Object.values(checks).every(
                (check) => check === 'ok'
            )

            if (isReady) {
                return {
                    status: 'ready',
                    checks
                }
            }

            return status(503, {
                status: 'not ready',
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
