import { Elysia } from 'elysia'
import Xss from 'xss'

const sanitize = (obj: unknown): unknown => {
    if (Array.isArray(obj)) {
        return obj.map((item) => sanitize(item))
    }
    if (typeof obj === 'object' && obj !== null) {
        const sanitized: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(obj)) {
            sanitized[key] = sanitize(value)
        }
        return sanitized
    }
    if (typeof obj === 'string') {
        return Xss(obj)
    }
    return obj
}

export const xss = new Elysia({ name: 'xss' }).derive(
    { as: 'global' },
    ({ body }) => {
        if (body && typeof body === 'object') {
            return {
                body: sanitize(body)
            }
        }
        return {}
    }
)
