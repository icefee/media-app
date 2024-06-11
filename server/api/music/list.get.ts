import { createApiAdaptor, adaptors } from '~/server/adaptors'
import { createPayload } from '~/util/middleware'

export default defineEventHandler(
    async (event) => {
        const { s } = getQuery(event)
        const list = (await Promise.all(
            adaptors.map<Promise<SearchMusic[] | null>>(
                (k) => {
                    const adaptor = createApiAdaptor(k)!
                    return adaptor.getMusicSearch(s as string)
                }
            )
        )).reduce(
            (prev, current) => current ? [...prev, ...current] : prev,
            []
        )
        return createPayload(list)
    }
)
