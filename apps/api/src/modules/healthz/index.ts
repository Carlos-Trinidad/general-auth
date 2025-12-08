import { Elysia, t } from 'elysia'

export const healthz = new Elysia({ name: 'healthz', prefix: '/healthz' })
    .get(
        '/live',
        () => ({
            status: 'ok'
        }),
        {
            response: {
                200: t.Object({
                    status: t.String()
                })
            }
        }
    )
    .get(
        '/ready',
        ({ status }) => {
            const checks: Record<string, string> = {}
            const isReady = true

            // TODO: Add actual dependency checks here
            // Example: Check database connection
            // try {
            //     await db.ping()
            //     checks.database = 'ok'
            // } catch (err) {
            //     checks.database = 'unavailable'
            //     isReady = false
            // }

            // For now, assume ready if the app is running
            checks.application = 'ok'

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
                200: t.Object({
                    status: t.String(),
                    checks: t.Record(t.String(), t.String())
                }),
                503: t.Object({
                    status: t.String(),
                    checks: t.Record(t.String(), t.String())
                })
            }
        }
    )
