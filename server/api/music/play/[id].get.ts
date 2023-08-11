import { createApiAdaptor, parseId } from '~/adaptors'

export default defineEventHandler(
    async (event) => {
        const { key, id } = parseId(event.context.params!.id)
        const adaptor = createApiAdaptor(key)!
        const url = await adaptor.parseMusicUrl(id)
        if (url) {
            return sendRedirect(event, url, 301)
        }
        else {
            return {
                code: -1,
                data: null,
                msg: '失败'
            }
        }
    }
)