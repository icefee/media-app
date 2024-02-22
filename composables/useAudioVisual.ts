import {
    unref,
    watch,
    computed,
    defineComponent,
    onBeforeMount,
    h as createElement,
    type CSSProperties
} from 'vue'
import type { MediaRefType } from './useMediaPlayState'
import useAudioContext from './useAudioContext'
import useResizeObserver from './useResizeObserver'

type AudioVisualProps = {
    /**
     * frequencyBinCount for AnalyserNode
     * optional,
     * default: 2048
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/AnalyserNode/frequencyBinCount)
     */
    fftSize?: number,
    /**
     * colors for gradient fill color
     * optional
     * default: ['#ff0000a0', '#ffff00a0', '#00ffffa0']
     */
    colors?: string[],
    /**
     * interval of bar, default 4, not equivalent to bar width
     */
    barInternal?: number,
    /**
     * space between bars, default 1
     */
    barSpace?: number,
    /**
     * height of caps, default 2
     */
    capHeight?: number,
    /**
     * gap between caps, default 2
     */
    capGap?: number
}

export function useAudioVisual(
    /**
     * the audio element ref
     */
    audio: MediaRefType,
) {

    const AudioVisual = defineComponent<AudioVisualProps>({
        setup(props) {
            const {
                fftSize,
                colors,
                barInternal,
                barSpace,
                capHeight,
                capGap
            } = {
                fftSize: 2048,
                colors: ['#ff0000a0', '#ffff00a0', '#00ffffa0'],
                barInternal: 4,
                barSpace: 1,
                capHeight: 2,
                capGap: 2,
                ...props
            }

            let dpr = 1;
            let caps: number[] = null;

            const { byteFrequency } = useAudioContext(audio, fftSize)

            const { ref, size } = useResizeObserver<HTMLCanvasElement>()

            const canvasSize = computed(() => {
                const { width, height } = unref(size)
                return {
                    width: width * dpr,
                    height: height * dpr
                }
            })

            const drawCanvas = (buffer: Uint8Array) => {
                const ctx = ref.value!.getContext('2d')!
                const { width, height } = unref(canvasSize)
                if (colors.length > 1) {
                    const gradient = ctx.createLinearGradient(width / 2, 0, width / 2, height)
                    for (let i = 0; i < colors.length; i++) {
                        gradient.addColorStop(i / (colors.length - 1), colors[i])
                    }
                    ctx.fillStyle = gradient
                }
                else {
                    ctx.fillStyle = colors[0] ?? '#fff'
                }
                ctx.clearRect(0, 0, width, height)
                const step = Math.floor(
                    fftSize / Math.ceil(width / barInternal / dpr)
                )
                const steps = Math.floor(fftSize / step);
                if (!caps || caps && caps.length !== steps) {
                    caps = Array.from({ length: steps }, _ => 0)
                }
                else {
                    caps = caps.map(
                        v => v > 0 ? v - 1 : v
                    )
                }
                const gapWidth = barSpace * dpr
                const interval = width / steps
                for (let i = 0; i < steps; i++) {
                    const intensity = Math.round(
                        buffer.slice(i, i + step).reduce(
                            (prev, current) => prev + current,
                            0
                        ) / step
                    )
                    if (intensity > caps[i]) {
                        caps[i] = intensity
                    }
                    const x = i * interval + gapWidth / 2
                    const barWidth = Math.max(interval - gapWidth, 1)
                    const rate = height / 255
                    ctx.fillRect(x, height - intensity * rate, barWidth, intensity * rate)
                    ctx.fillRect(x, height - caps[i] * rate - capGap * dpr, barWidth, capHeight * dpr)
                }
            }

            onBeforeMount(() => {
                dpr = window.devicePixelRatio
            })

            onMounted(() => {
                drawCanvas(byteFrequency.value)
            })

            watch(
                [byteFrequency, size],
                () => {
                    drawCanvas(byteFrequency.value)
                },
                {
                    flush: 'post'
                }
            )

            const staticStyles = <CSSProperties>{
                width: '100%',
                height: '100%',
            }

            return () => {
                const { width, height } = canvasSize.value
                return createElement('canvas', {
                    ref,
                    width,
                    height,
                    style: {
                        display: 'block',
                        ...staticStyles
                    }
                })
            }
        }
    })

    return AudioVisual;
}
