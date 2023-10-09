import { ref, shallowRef, onMounted, onUnmounted } from 'vue'

function usePrefersColorScheme() {
    const colorScheme = ref('light')
    const mediaMatch = shallowRef<MediaQueryList | null>(null)

    const updateColorScheme = () => {
        colorScheme.value = mediaMatch.value.matches ? 'dark': 'light'
    }

    onMounted(() => {
        mediaMatch.value = window.matchMedia('(prefers-color-scheme: dark)')
        mediaMatch.value.addEventListener('change', updateColorScheme)
        updateColorScheme()
    })

    onUnmounted(() => {
        mediaMatch.value.removeEventListener('change', updateColorScheme)
    })

    return colorScheme
}

export default usePrefersColorScheme