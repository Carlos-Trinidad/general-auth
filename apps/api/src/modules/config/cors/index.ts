import { cors as Cors } from '@elysiajs/cors'
import { EnvironmentVariables } from '@api/modules/config'

export const cors = Cors({
    origin: EnvironmentVariables.ORIGIN
})
