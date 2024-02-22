import { ref, onUnmounted, watch, watchPostEffect } from 'vue'
import useMediaPlayState, { type MediaRefType } from './useMediaPlayState'
import useRequestAnimationFrame from './useRequestAnimationFrame'

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

    watchPostEffect(() => {
        if (playing.value) {
            if (!audioContext) {
                audioContext = new AudioContext()
                mediaSource = audioContext.createMediaElementSource(audio.value)
                analyser = audioContext.createAnalyser()
                mediaSource.connect(analyser)
                analyser.connect(audioContext.destination)
            }
            analyser.fftSize = fftSize
            audioContext.resume()
        }
    })

    onUnmounted(dispose)

    watch(
        [ts, playing],
        () => {
            if (audioContext && playing.value) {
                startAnalyser()
            }
        }
    )

    return { byteFrequency }
}

export default useAudioContext;
