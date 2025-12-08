import { describe, it, expect } from 'bun:test'
import { HealthzChecks } from './service'

describe('HealthzChecks', () => {
    describe('perform', () => {
        it('should return an object with health check results', async () => {
            const result = await HealthzChecks.perform()

            expect(result).toBeTypeOf('object')
        })

        it('should return application status as ok', async () => {
            const result = await HealthzChecks.perform()

            expect(result).toHaveProperty('application', 'ok')
        })

        it('should return Record<string, string> type', async () => {
            const result = await HealthzChecks.perform()

            // Verify all values are strings
            Object.values(result).forEach((value) => {
                expect(value).toBeTypeOf('string')
            })

            // Verify all keys are strings
            Object.keys(result).forEach((key) => {
                expect(key).toBeTypeOf('string')
            })
        })

        it('should return at least one health check', async () => {
            const result = await HealthzChecks.perform()

            expect(Object.keys(result).length).toBeGreaterThan(0)
        })
    })
})
