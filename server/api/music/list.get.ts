import { createApiAdaptor, adaptors } from '~/server/adaptors'

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

        if (list) {
            return {
                code: 0,
                data: list,
                msg: '成功'
            }
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
