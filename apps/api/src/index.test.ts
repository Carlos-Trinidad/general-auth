import { describe, it, expect } from 'bun:test'
import { treaty } from '@elysiajs/eden'

import { app } from '@api'

const api = treaty(app)

describe('core', () => {
    it('works', async () => {
        const { data } = await api.get()

        expect(data).toBe('Hello World')
    })
})
