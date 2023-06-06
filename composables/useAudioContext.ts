import { ref, shallowRef, onMounted, onUnmounted, watch } from 'vue';
import useMediaPlayState, { MediaRefType } from './useMediaPlayState';
import useRequestAnimationFrame from './useRequestAnimationFrame';

function useAudioContext(audio: MediaRefType, fftSize = 2048) {
    const { playing } = useMediaPlayState(audio)
    const audioContext = shallowRef<AudioContext>()
    const mediaSource = shallowRef<MediaElementAudioSourceNode>()
    const analyser = shallowRef<AnalyserNode>()
    const byteFrequency = ref<Uint8Array>(new Uint8Array(fftSize))
    const ts = useRequestAnimationFrame()

    const startAnalyser = () => {
        const buffer = new Uint8Array(fftSize);
        analyser.value!.getByteFrequencyData(buffer);
        byteFrequency.value = buffer;
    }

    const dispose = () => {
        audioContext.value!.suspend();
        mediaSource.value!.disconnect();
        analyser.value!.disconnect();
    }

    onMounted(() => {
        audioContext.value = new AudioContext();
        mediaSource.value = audioContext.value.createMediaElementSource(audio.value);
        analyser.value = audioContext.value.createAnalyser();
    })
    onUnmounted(dispose)

    watch(
        [playing],
        () => {
            if (playing.value) {
                analyser.value!.fftSize = fftSize;
                mediaSource.value!.connect(analyser.value!);
                analyser.value!.connect(audioContext.value!.destination);
                audioContext.value!.resume();
            }
            else {
                dispose()
            }
        })

    watch(
        [ts, playing],
        () => {
            if (playing.value) {
                startAnalyser()
            }
        })

    return { byteFrequency }
}

export default useAudioContext;
