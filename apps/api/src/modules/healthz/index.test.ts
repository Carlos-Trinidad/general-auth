import { describe, it, expect } from 'bun:test'
import { treaty } from '@elysiajs/eden'

import { app } from '@api'

const api = treaty(app)

describe('healthz', () => {
    describe('/healthz/live', () => {
        it('should return 200 status', async () => {
            const { status } = await api.healthz.live.get()

            expect(status).toBe(200)
        })

        it('should return ok status in response body', async () => {
            const { data } = await api.healthz.live.get()

            expect(data).toEqual({
                status: 'ok'
            })
        })
    })

    describe('/healthz/ready', () => {
        it('should return 200 status when ready', async () => {
            const { status } = await api.healthz.ready.get()

            expect(status).toBe(200)
        })

        it('should return ready status in response body', async () => {
            const { data } = await api.healthz.ready.get()

            expect(data).toHaveProperty('status', 'ready')
        })

        it('should include checks object', async () => {
            const { data } = await api.healthz.ready.get()

            expect(data).toHaveProperty('checks')
            expect(data?.checks).toBeTypeOf('object')
        })

        it('should include application check', async () => {
            const { data } = await api.healthz.ready.get()

            expect(data?.checks).toHaveProperty('application', 'ok')
        })
    })
})
