<template>
    <video class="block w-full h-full bg-black" ref="videoRef" controls />
</template>

<script lang="ts" setup>
import { shallowRef, withDefaults, onMounted, onUnmounted, watch } from 'vue'
import Hls from 'hls.js'

const props = withDefaults(defineProps<{
    url: string;
    hls: boolean;
}>(), {
    hls: false
})

const videoRef = shallowRef<HTMLVideoElement>()
const hls = shallowRef<Hls>()

const initPlayer = () => {
    const video = videoRef.value;
    if (props.hls && Hls.isSupported()) {
        if (!hls.value) {
            hls.value = new Hls();
            hls.value.attachMedia(video);
        }
        hls.value.loadSource(props.url);
    }
    else {
        video.src = props.url;
        video.load();
    }
}

const disposePlayer = () => {
    hls.value?.detachMedia();
    hls.value?.destroy();
}

onMounted(initPlayer)

watch(() => props.url, initPlayer)

onUnmounted(disposePlayer)
</script>
