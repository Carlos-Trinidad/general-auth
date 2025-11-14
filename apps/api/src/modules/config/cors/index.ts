import { cors as CORS } from '@elysiajs/cors'
import { EnvironmentVariables } from '@api/modules/config'

export const cors = CORS({
    origin: EnvironmentVariables.ORIGIN
})
