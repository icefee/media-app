import { Readable } from 'stream'
import { parseId, createApiAdaptor, getResponse } from '~/server/adaptors'
import { createErrorPayload, fileNotFound } from '~/util/middleware'

export default defineEventHandler(
    async (event) => {
        const { key, id } = parseId(event.context.params!.id)
        const adaptor = createApiAdaptor(key)!
        const url = await adaptor.parseMusicUrl(id)
        const response = await getResponse(url!)
        const headers = response.headers
        const contentType = headers.get('content-type')
        if (contentType && contentType.match(/text\/html/)) {
            setResponseStatus(event, 200)
            return createErrorPayload(fileNotFound)
        }
        else {
            for (const key of headers.keys()) {
                setHeader(event, key, headers.get(key)!)
            }
            const { name } = getQuery(event)
            if (name) {
                setHeader(event, 'content-disposition', `attachment; filename* = utf-8''${encodeURIComponent(name as string)}.mp3`)
            }
            const arrayBuffer = await response.arrayBuffer()
            return sendStream(event, Readable.from(Buffer.from(arrayBuffer)))
        }
    }
)
