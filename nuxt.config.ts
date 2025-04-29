// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    typescript: {
        strict: true
    },
    ui: {
        fonts: false
    },
    css: ['~/assets/style.css'],
    modules: ['@nuxt/ui'],
    app: {
        head: {
            link: [
                {
                    rel: 'stylesheet',
                    href: '/global.css'
                }
            ]
        }
    },
    compatibilityDate: 'latest'
})
