import { ref, watch, onMounted } from 'vue'

function useLocalStorage<T = any>(
    key: string,
    initValue: T,
    option?: {
        raw: true
    } | {
        serializer: (value: T) => string;
        deserializer: (value: string) => T;
    }
) {
    const state = ref<T>(initValue)
    // const csr = 'localStorage' in globalThis
    const opts = option ?? {
        serializer: JSON.stringify,
        deserializer: JSON.parse
    }
    const isRaw = 'raw' in opts
    const setInitValue = () => {
        const cached = localStorage.getItem(key)
        state.value = isRaw ? cached : opts.deserializer(cached)
    }
    onMounted(setInitValue)
    watch(state, (value) => {
        localStorage.setItem(
            key,
            isRaw ? value as string : opts?.serializer(value)
        )
    })
    return state
}

export default useLocalStorage