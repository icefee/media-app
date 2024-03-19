import { Api } from './config'
import { Base64Params } from './clue'

export function getParamsUrl(url: string, params: Record<string, string>) {
    const urlSearchParams = new URLSearchParams(params)
    return `${url}?${urlSearchParams}`
}

export function proxyUrl(url: string, extend = {}) {
    return getParamsUrl(`${Api.assetSite}/api/proxy`, {
        url,
        ...extend
    })
}

export function proxyHlsUrl(url: string) {
    const token = Base64Params.create(url)
    return `${Api.assetSite}/api/video/hls/proxy/${token}.m3u8`
}