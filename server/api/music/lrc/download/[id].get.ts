import { createApiAdaptor, parseId, getResponse } from '~/server/adaptors'
import { Readable } from 'stream'

export default defineEventHandler(
    async (event) => {
        const { key, id } = parseId(event.context.params!.id)
        const adaptor = createApiAdaptor(key)!
        const { name } = getQuery(event)
        if (name) {
            setHeader(event, 'content-disposition', `attachment; filename* = utf-8''${encodeURIComponent(name as string)}.lrc`)
        }
        if (adaptor.lrcFile) {
            const response = await getResponse(adaptor.getLrcUrl(id));
            const headers = response.headers;
            for (const key of headers.keys()) {
                setHeader(event, key, headers.get(key)!)
            }
            const arrayBuffer = await response.arrayBuffer()
            return sendStream(event, Readable.from(Buffer.from(arrayBuffer)))
        }
        else {
            const lrcText = await adaptor.getLrcText(id)
            if (lrcText) {
                setHeader(event, 'content-type', 'text/lrc')
                send(event, lrcText)
            }
            else {
                return {
                    code: -1,
                    data: null,
                    msg: 'lrc file not found.'
                }
            }
        }
    }
)
