import { ref, Ref, ShallowRef, onUnmounted, watch } from 'vue';

export type MediaRefType = Ref<HTMLMediaElement> | ShallowRef<HTMLMediaElement>;

function useMediaPlayState(media: MediaRefType) {
    const playing = ref(false)
    const onPlay = () => {
        playing.value = true;
    }
    const onPause = () => {
        playing.value = false;
    }
    const dispose = () => {
        media.value.removeEventListener('play', onPlay)
        media.value.removeEventListener('pause', onPause)
    }
    watch(
        [media],
        () => {
            if (media.value) {
                media.value.addEventListener('play', onPlay)
                media.value.addEventListener('pause', onPause)
            }
            else {
                dispose()
            }
        })
    onUnmounted(dispose)
    return { playing }
}

export default useMediaPlayState;
