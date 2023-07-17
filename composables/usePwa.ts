function generateIcons() {
    const iconSizes = [
        6,
        9,
        12,
        18,
        24,
        32,
        48,
        64
    ], unity = 8;
    return iconSizes.map(
        size => {
            const s = size * unity
            const sizes = `${s}x${s}`
            return {
                sizes,
                src: `/icons/icon-${sizes}.png`
            }
        }
    )
}

function usePwa() {

    const icons = generateIcons()

    useHead({
        link: [
            {
                rel: 'icon',
                href: '/icons/favicon-32x32.png',
                type: 'image/png'
            },
            {
                rel: 'manifest',
                href: '/manifest.json',
                crossorigin: 'anonymous'
            },
            ...icons.map(
                ({ sizes, src }) => ({
                    rel: 'apple-touch-icon',
                    sizes,
                    href: src
                })
            )
        ]
    })
}

export default usePwa