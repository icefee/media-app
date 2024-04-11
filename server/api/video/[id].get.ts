import { getJson } from '../../adaptors'
import { Api } from '~/util/config'
import { Clue } from '~/util/clue'
import { proxyUrl, pureHlsUrl } from '~/util/proxy'
import { createPayload, createErrorPayload } from '~/util/middleware'

const getVideoData = async (url: string) => {
    try {
        const { data } = await getJson<ApiJsonType<VideoInfo>>(url)
        return data
    }
    catch (err) {
        return null
    }
}

export default defineEventHandler(
    async (event) => {
        const { id: queryId } = event.context.params!
        const { key, id } = Clue.parse(queryId)!
        const { type, pure } = getQuery<Record<'type' | 'pure', string>>(event)
        const apiUrl = `${Api.site}/api/video/${key}/${id}`
        const data = await getVideoData(apiUrl)
        if (type === 'poster') {
            return sendRedirect(event, data ? proxyUrl(data.pic) : `/image_fail.jpg`, 301)
        }
        else {
            if (data) {
                if (pure === '0') {
                    return createPayload(data)
                }
                const { dataList, ...rest } = data
                return createPayload({
                    ...rest,
                    dataList: dataList.map(
                        ({ name, urls }) => ({
                            name,
                            urls: urls.map(
                                ({ label, url }) => ({
                                    label,
                                    url: /.m3u8$/.test(url) ? pureHlsUrl(url) : url
                                })
                            )
                        })
                    )
                })
            }
            return createErrorPayload()
        }
    }
)