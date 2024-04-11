import { Api } from './config'
import { Base64Params } from './clue'

const assetApiPrefix = `${Api.assetSite}/api/video/hls`

export interface UrlParser {
    (url: string): string;
}

export function getParamsUrl(
    url: string,
    params: Record<string, string>
) {
    const urlSearchParams = new URLSearchParams(params)
    return `${url}?${urlSearchParams}`
}

export function proxyUrl(url: string, extend = {}) {
    return getParamsUrl(`${Api.assetSite}/api/proxy`, {
        url,
        ...extend
    })
}

function parseTokenUrl(url: string, parser: UrlParser) {
    const token = Base64Params.create(url)
    return parser(token)
}

export function pureHlsUrl(url: string) {
    return parseTokenUrl(
        url,
        clue => `${assetApiPrefix}/pure/${clue}.m3u8`
    )
}

export function proxyHlsUrl(url: string) {
    return parseTokenUrl(
        url,
        clue => `${assetApiPrefix}/proxy/${clue}.m3u8`
    )
}