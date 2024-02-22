import { ref, onMounted, onUnmounted } from 'vue'

function useRequestAnimationFrame() {
    const raf = ref<number | null>(null)
    const ts = ref(0)
    const loop = () => {
        ts.value = +new Date;
        raf.value = requestAnimationFrame(loop)
    }
    const cancelLoop = () => {
        cancelAnimationFrame(raf.value!)
    }
    onMounted(loop)
    onUnmounted(cancelLoop)
    return ts;
}

export default useRequestAnimationFrame;
