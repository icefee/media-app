import { getJson } from '~/server/adaptors'
import { Api } from '~/util/config'
import { createErrorPayload } from '~/util/middleware'

export default defineEventHandler(
    async (event) => {
        try {
            const params = new URLSearchParams(
                getQuery(event)
            )
            const response = await getJson(`${Api.site}/api/video/list?${params}`)
            return response
        }
        catch (err) {
            return createErrorPayload(err)
        }
    }
)
