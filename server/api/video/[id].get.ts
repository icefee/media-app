import { getJson } from '~/adaptors';
import { Api } from '~/util/config';
import Clue from '~/util/clue';

const getVideoData = async (url: string) => {
    try {
        const { data } = await getJson(url);
        return data;
    }
    catch (err) {
        return null;
    }
}

export default defineEventHandler(
    async (event) => {
        const { id: queryId } = event.context.params!;
        const { api, id } = Clue.parse(queryId)!;
        const { type } = getQuery(event);
        const apiUrl = `${Api.site}/api/video/${api}/${id}`;
        const data = await getVideoData(apiUrl);
        if (type === 'poster') {
            return sendRedirect(event, data ? data.pic : `/image_fail.jpg`, 301)
        }
        else {
            return data ? {
                code: 0,
                data,
                msg: '成功'
            } : {
                code: -1,
                data: null,
                msg: '失败'
            }
        }
    }
)
