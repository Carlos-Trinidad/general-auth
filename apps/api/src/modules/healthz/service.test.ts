import { describe, it, expect } from 'bun:test'
import type { HealthzChecksResponse } from './model'
import { HealthzChecks } from './service'

describe('HealthzChecks', () => {
    describe('perform', () => {
        it('should return an object with health check results', async () => {
            const result = await HealthzChecks.perform()

            expect(result).toBeTypeOf('object')
        })

        it('should return application status as up', async () => {
            const result = await HealthzChecks.perform()

            expect(result).toHaveProperty('application', 'up')
        })

        it('should return HealthzChecksResponse type', async () => {
            const result = await HealthzChecks.perform()

            // Type assertion to ensure it matches HealthzChecksResponse
            const typedResult: HealthzChecksResponse = result

            // Verify all values are either 'up' or 'down'
            Object.values(typedResult).forEach((value) => {
                expect(['up', 'down']).toContain(value)
            })

            // Verify all keys are either 'application' or 'database'
            Object.keys(typedResult).forEach((key) => {
                expect(['application', 'database']).toContain(key)
            })
        })

        it('should return at least one health check', async () => {
            const result = await HealthzChecks.perform()

            expect(Object.keys(result).length).toBeGreaterThan(0)
        })
    })
})
