import { ref, shallowRef, onMounted, onUnmounted } from 'vue';

function useResizeObserver<T extends HTMLElement = HTMLDivElement>() {

    const elm = shallowRef<T>()
    const observer = shallowRef<ResizeObserver>()
    const size = ref({
        width: 0,
        height: 0
    })

    const onResize = () => {
        const width = elm.value!.clientWidth;
        const height = elm.value!.clientHeight;
        size.value = {
            width,
            height
        };
    }

    onMounted(() => {
        observer.value = new ResizeObserver(onResize)
        observer.value.observe(elm.value!)

        onResize()
    })

    onUnmounted(() => {
        observer.value!.unobserve(elm.value!)
    })

    return {
        ref: elm,
        size
    }

}

export default useResizeObserver;
