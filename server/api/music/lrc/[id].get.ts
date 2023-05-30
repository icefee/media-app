import { createApiAdaptor, parseId } from '~/adaptors';

export default defineEventHandler(
    async (event) => {
        const { key, id } = parseId(event.context.params!.id);
        const adaptor = createApiAdaptor(key)!;
        const lrc = await adaptor.parseLrc(id);
        if (lrc) {
            return {
                code: 0,
                data: lrc,
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
