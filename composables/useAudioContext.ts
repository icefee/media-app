import { ref, onMounted, onUnmounted, watch } from 'vue';
import useMediaPlayState, { MediaRefType } from './useMediaPlayState';
import useRequestAnimationFrame from './useRequestAnimationFrame';

function useAudioContext(audio: MediaRefType, fftSize = 2048) {
    const { playing } = useMediaPlayState(audio)
    let audioContext: AudioContext = null
    let mediaSource: MediaElementAudioSourceNode = null
    let analyser: AnalyserNode = null
    const byteFrequency = ref<Uint8Array>(new Uint8Array(fftSize))
    const ts = useRequestAnimationFrame()

    const startAnalyser = () => {
        const buffer = new Uint8Array(fftSize)
        analyser.getByteFrequencyData(buffer)
        byteFrequency.value = buffer
    }

    const dispose = () => {
        audioContext.suspend()
        mediaSource.disconnect()
        analyser.disconnect()
    }

    onMounted(() => {
        audioContext = new AudioContext()
        mediaSource = audioContext.createMediaElementSource(audio.value)
        analyser = audioContext.createAnalyser()
    })
    onUnmounted(dispose)

    watch(
        [playing],
        () => {
            if (playing.value) {
                analyser.fftSize = fftSize
                mediaSource.connect(analyser)
                analyser.connect(audioContext.destination)
                audioContext.resume()
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
