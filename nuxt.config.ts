// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    typescript: {
        strict: true
    },
    modules: [
        '@nuxt/ui'
    ],
    app: {
        head: {
            link: [
                {
                    rel: 'stylesheet',
                    href: '/global.css'
                }
            ]
        }
    }
})
