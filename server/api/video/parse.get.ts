import { getJson } from '~/adaptors';
import { Api } from '~/util/config';

export default defineEventHandler(
    async (event) => {
        const { url } = getQuery(event)
        try {
            const response = await getJson(`${Api.assetSite}/api/video/parse?url=${url}`)
            return response
        }
        catch (err) {
            return {
                code: -1,
                msg: String(err)
            }
        }
    }
)
