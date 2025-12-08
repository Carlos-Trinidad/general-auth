import { Elysia } from 'elysia'
import {
    logger as Logger,
    serializers,
    serializeRequest
} from '@bogeychan/elysia-logger'
import { EnvironmentVariables } from '@api/config/environment'

import { version, name } from 'package.json'

const BYPASS_URL = new Set([
    '/healthz',
    '/healthz/readiness',
    '/healthz/',
    '/healthz/liveness'
])

const X_CORRELATION_ID = EnvironmentVariables.CORRELATION_ID ?? 'X-Request-ID'

export const logger = new Elysia({ name: 'logger' })
    .onRequest(({ request }) => {
        request.headers.set(
            X_CORRELATION_ID,
            request.headers.get(X_CORRELATION_ID) ?? crypto.randomUUID()
        )
    })
    .use(
        Logger({
            serializers: {
                ...serializers,
                request: (request: Request) => {
                    const url = new URL(request.url)

                    return {
                        ...serializeRequest(request),
                        // https://http.dev/x-request-id
                        id: request.headers.get(X_CORRELATION_ID),
                        path: url.pathname,
                        headers: request.headers.toJSON()
                    }
                }
            },
            customProps: ({ user }) => {
                const props = {}
                if (user) return { ...props, user }
                return props
            },
            level: EnvironmentVariables.LOG_LEVEL,
            transport:
                EnvironmentVariables.NODE_ENV === 'local'
                    ? { target: 'pino-pretty' }
                    : undefined,
            messageKey: 'message',
            errorKey: 'error',
            redact: ['request.headers.authorization', 'request.headers.cookie'],
            formatters: {
                bindings: (bindings) => {
                    return {
                        pid: bindings.pid,
                        host: bindings.hostname,
                        node_version: process.version,
                        app_name: name,
                        app_version: version
                    }
                },
                level: (label) => {
                    return { level: label.toUpperCase() }
                }
            },
            autoLogging: {
                ignore: ({ request }) => BYPASS_URL.has(request.url)
            }
        })
    )
    .as('global')
