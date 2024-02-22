import { ref, onUnmounted, watchEffect, type Ref } from 'vue'

export type MediaRefType = Ref<HTMLMediaElement | null>;

function useMediaPlayState(media: MediaRefType) {
    const playing = ref(false)
    const onPlay = () => {
        playing.value = true
    }
    const onPause = () => {
        playing.value = false
    }
    const dispose = () => {
        media.value?.removeEventListener('play', onPlay)
        media.value?.removeEventListener('pause', onPause)
    }
    watchEffect(
        (onCleanup) => {
            media.value?.addEventListener('play', onPlay)
            media.value?.addEventListener('pause', onPause)
            onCleanup(dispose)
        }
    )
    onUnmounted(dispose)
    return {
        playing
    }
}

export default useMediaPlayState;
