import { createApiAdaptor, adaptors } from '~/server/adaptors'
import { createPayload } from '~/util/middleware'

export default defineEventHandler(
    async (event) => {
        const { s } = getQuery(event)
        const list: SearchMusic[] = []
        for (const k of adaptors) {
            const adaptor = createApiAdaptor(k)!
            const result = await adaptor.getMusicSearch(s as string)
            if (result) {
                list.push(...result)
            }
        }
        return createPayload(list)
    }
)
