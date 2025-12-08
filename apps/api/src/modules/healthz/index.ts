import { Elysia } from 'elysia'
import { HealthzChecks } from '@api/modules/healthz/service'
import { HealthzModels } from '@api/modules/healthz/model'

export const healthz = new Elysia({
    name: 'healthz',
    prefix: '/healthz',
    tags: ['Healthz']
})
    .model({
        'healthz.live': HealthzModels.liveResponse,
        'healthz.ready': HealthzModels.readyResponse
    })
    .get('/live', ({ status }) => status(200, { status: 'up' }), {
        detail: {
            summary: 'Liveness probe',
            description: 'Check if the application is alive and running',
            tags: ['Healthz']
        },
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
                return status(200, {
                    status: 'up',
                    checks
                })
            }

            return status(503, {
                status: 'down',
                checks
            })
        },
        {
            detail: {
                summary: 'Readiness probe',
                description:
                    'Check if the application is ready to accept traffic',
                tags: ['Healthz']
            },
            response: {
                200: 'healthz.ready',
                503: 'healthz.ready'
            }
        }
    )
