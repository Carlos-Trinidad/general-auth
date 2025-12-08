import { openapi as openApi, fromTypes } from '@elysiajs/openapi'
import { EnvironmentVariables } from '@api/config'

export const openapi = openApi({
    references: fromTypes(
        EnvironmentVariables.NODE_ENV === 'production'
            ? 'dist/src/index.d.ts'
            : 'src/index.ts'
    )
})
