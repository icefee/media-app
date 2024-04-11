import { createApiAdaptor, parseId } from '~/server/adaptors'
import { createErrorPayload, fileNotFound } from '~/util/middleware'

export default defineEventHandler(
    async (event) => {
        const { key, id } = parseId(event.context.params!.id)
        const adaptor = createApiAdaptor(key)!
        const { name } = getQuery(event)
        if (name) {
            setHeader(event, 'content-disposition', `attachment; filename* = utf-8''${encodeURIComponent(name as string)}.lrc`)
        }
        const lrcText = await adaptor.getLrcText(id)
        if (lrcText) {
            setHeader(event, 'content-type', 'text/lrc')
            send(event, lrcText)
        }
        else {
            return createErrorPayload(fileNotFound)
        }
    }
)
