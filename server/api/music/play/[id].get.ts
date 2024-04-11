import { createApiAdaptor, parseId } from '~/server/adaptors'
import { createErrorPayload, fileNotFound } from '~/util/middleware'

export default defineEventHandler(
    async (event) => {
        const { key, id } = parseId(event.context.params!.id)
        const adaptor = createApiAdaptor(key)!
        const url = await adaptor.parseMusicUrl(id)
        if (url) {
            return sendRedirect(event, url, 301)
        }
        else {
            return createErrorPayload(fileNotFound)
        }
    }
)