import { createApiAdaptor, parseId } from '~/server/adaptors'
import { createPayload, createErrorPayload } from '~/util/middleware'

export default defineEventHandler(
    async (event) => {
        const { key, id } = parseId(event.context.params!.id)
        const adaptor = createApiAdaptor(key)!
        const lrc = await adaptor.parseLrc(id)
        return lrc ? createPayload(lrc) : createErrorPayload()
    }
)
