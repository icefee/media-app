import { getJson } from '~/server/adaptors'
import { Api } from '~/util/config'
import { createErrorPayload } from '~/util/middleware'

export default defineEventHandler(
    async (event) => {
        const searchParams = new URLSearchParams(
            getQuery(event) as Record<string, string>
        )
        try {
            const response = await getJson(`${Api.site}/api/video/list?${searchParams}`)
            return response
        }
        catch (err) {
            return createErrorPayload(err)
        }
    }
)
