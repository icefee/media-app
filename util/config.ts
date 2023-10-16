import { isDev } from './env'

export abstract class Api {
    private static localhost = '127.0.0.1'
    public static site = isDev ? `http://${Api.localhost}:420` : 'http://cik.netlify.app'
    public static assetSite = 'https://spacedeta-4-f1000878.deta.app'
}
