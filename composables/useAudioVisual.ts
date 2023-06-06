import { shallowRef, watch, computed, h as createElement } from 'vue';
import type { MediaRefType } from './useMediaPlayState';
import useAudioContext from './useAudioContext';
import useResizeObserver from './useResizeObserver';

export function useAudioVisual(
    /**
     * the audio element ref created by useRef() or React.createRef()
     */
    audio: MediaRefType,
    /**
     * frequencyBinCount for AnalyserNode
     * optional,
     * default: 1024
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/AnalyserNode/frequencyBinCount)
     */
    fftSize = 1024,
    /**
     * colors for gradient fill color
     * optional
     * default: ['#ff0000a0', '#ffff00a0', '#00ffffa0']
     */
    colors = ['#ff0000a0', '#ffff00a0', '#00ffffa0']
) {

    const dpr = window.devicePixelRatio;
    const barWidth = 4 * dpr;
    const barSpace = 1 * dpr;
    const capHeight = 2;
    const capGap = 2;

    const caps = shallowRef<number[]>()

    const { byteFrequency } = useAudioContext(audio, fftSize)

    const { ref, size } = useResizeObserver()

    const canvas = shallowRef<HTMLCanvasElement | null>(null)

    const canvasSize = computed(() => {
        const width = size.value.width * dpr, height = size.value.height * dpr;
        return {
            width,
            height
        }
    })

    const drawCanvas = (buffer: Uint8Array) => {
        const ctx = canvas.value!.getContext('2d')!;
        const { width, height } = canvasSize.value;
        const gradient = ctx.createLinearGradient(width / 2, 0, width / 2, height);
        for (let i = 0; i < colors.length; i++) {
            gradient.addColorStop(i / (colors.length - 1), colors[i]);
        }
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = gradient;
        const step = Math.floor(
            (barWidth + barSpace) * fftSize / width
        );
        const steps = Math.floor(fftSize / step);
        if (!caps.value || caps.value && caps.value.length !== steps) {
            caps.value = Array.from({ length: steps }, _ => 0)
        }
        else {
            caps.value = caps.value.map(
                v => v > 0 ? v - 1 : v
            )
        }
        for (let i = 0; i < steps; i++) {
            const intensity = Math.round(
                buffer.slice(i, i + step).reduce(
                    (prev, current) => prev + current,
                    0
                ) / step)
            if (intensity > caps.value[i]) {
                caps.value[i] = intensity;
            }
            const x = i * (barWidth + barSpace) + barSpace / 2;
            ctx.fillRect(x, height - intensity * height / 255, barWidth, intensity * height / 255);
            ctx.fillRect(x, height - caps.value[i] * height / 255 - capHeight - capGap, barWidth, capHeight);
        }
    }

    watch(
        [byteFrequency],
        () => {
            drawCanvas(byteFrequency.value)
        })

    const outlet = () => {
        const { width, height } = canvasSize.value;
        return createElement('div', {
            style: {
                width: '100%',
                height: '100%',
            },
            ref,
        }, createElement('canvas', {
            ref: canvas,
            width,
            height,
            style: {
                display: 'block',
                width: '100%',
                height: '100%'
            }
        }))
    }

    return outlet;
}
