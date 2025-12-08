import { describe, it, expect, spyOn } from 'bun:test'
import { treaty } from '@elysiajs/eden'
import { Elysia } from 'elysia'

import { healthz } from '.'
import { HealthzChecks } from '@api/modules/healthz/service'

describe('healthz', () => {
    describe('/healthz/live', () => {
        it('should return 200 status', async () => {
            const app = new Elysia().use(healthz)
            const api = treaty(app)

            const { status } = await api.healthz.live.get()

            expect(status).toBe(200)
        })

        it('should return ok status in response body', async () => {
            const app = new Elysia().use(healthz)
            const api = treaty(app)

            const { data } = await api.healthz.live.get()

            expect(data).toEqual({
                status: 'ok'
            })
        })
    })

    describe('/healthz/ready', () => {
        it('should return 200 status when ready', async () => {
            const app = new Elysia().use(healthz)
            const api = treaty(app)

            const { status } = await api.healthz.ready.get()

            expect(status).toBe(200)
        })

        it('should return ready status in response body', async () => {
            const app = new Elysia().use(healthz)
            const api = treaty(app)

            const { data } = await api.healthz.ready.get()

            expect(data).toHaveProperty('status', 'ready')
        })

        it('should include checks object', async () => {
            const app = new Elysia().use(healthz)
            const api = treaty(app)

            const { data } = await api.healthz.ready.get()

            expect(data).toHaveProperty('checks')
            expect(data?.checks).toBeTypeOf('object')
        })

        it('should include application check', async () => {
            const app = new Elysia().use(healthz)
            const api = treaty(app)

            const { data } = await api.healthz.ready.get()

            expect(data?.checks).toHaveProperty('application', 'ok')
        })

        it('should return 503 when health checks fail', async () => {
            // Mock the perform function to return failing checks
            const performSpy = spyOn(HealthzChecks, 'perform')
            performSpy.mockResolvedValue({
                database: 'unavailable',
                application: 'ok'
            })

            const app = new Elysia().use(healthz)
            const api = treaty(app)

            const response = await api.healthz.ready.get()

            expect(response.status).toBe(503)
            expect(response.error).toBeDefined()
            expect(response.error?.value).toHaveProperty('status', 'not ready')

            const errorValue = response.error?.value as {
                status: string
                checks: Record<string, string>
            }
            expect(errorValue?.checks).toHaveProperty('database', 'unavailable')
            expect(errorValue?.checks).toHaveProperty('application', 'ok')

            // Restore the original implementation
            performSpy.mockRestore()
        })
    })
})
