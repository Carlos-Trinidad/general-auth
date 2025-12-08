import { Elysia } from 'elysia'
import { helmet as Helmet } from 'elysia-helmet'

// Permissive settings for OpenAPI UI
export const helmet = new Elysia({ name: 'helmet' }).use(
    Helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
    })
)
