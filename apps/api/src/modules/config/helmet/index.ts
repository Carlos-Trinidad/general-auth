import { Elysia } from 'elysia'
import { helmet as Helmet } from 'elysia-helmet'

// see {@link https://stackoverflow.com/questions/60706823/what-modules-of-helmet-should-i-use-in-my-rest-api}
export const helmet = new Elysia({ name: 'helmet' }).use(
    Helmet({
        frameguard: true,
        hsts: true,
        noSniff: true,
        permittedCrossDomainPolicies: true,
        hidePoweredBy: true,
        contentSecurityPolicy: false,
        dnsPrefetchControl: false,
        ieNoOpen: false,
        referrerPolicy: false,
        xssFilter: false
    })
)
