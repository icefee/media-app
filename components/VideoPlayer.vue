<template>
    <video class="block w-full h-full bg-black" ref="videoRef" controls @canplay="onCanPlay" @timeupdate="onTimeUpdate"
        @ended="onEnded" />
</template>

<script lang="ts" setup>
import { shallowRef, onMounted, onUnmounted, watch } from 'vue'
import Hls from 'hls.js'

const props = withDefaults(defineProps<{
    url: string;
    autoplay?: boolean;
    hls?: boolean;
    initPlayTime?: number;
}>(), {
    autoplay: false,
    hls: false,
    initPlayTime: 0
})

const emit = defineEmits<{
    (e: 'timeupdate', value: number): void;
    (e: 'ended'): void;
}>()

const videoRef = shallowRef<HTMLVideoElement>()
let hls: Hls | null = null

const canPlayEventFired = shallowRef(false)

const onMainfestParsed = () => {
    hls.startLoad(props.initPlayTime)
}

const onMediaAttached = () => {
    tryToAutoPlay()
}

const tryToAutoPlay = async () => {
    if (props.autoplay) {
        try {
            await videoRef.value.play()
        }
        catch (err) {
            if (err.name === 'NotAllowedError') {
                console.warn('auto play failed because of browser security policy')
            }
        }
    }
}

const initPlayer = () => {
    const video = videoRef.value;
    if (props.hls && Hls.isSupported()) {
        if (!hls) {
            hls = new Hls({
                autoStartLoad: false
            });
            hls.attachMedia(video);
        }
        hls.on(Hls.Events.MANIFEST_PARSED, onMainfestParsed);
        hls.on(Hls.Events.MEDIA_ATTACHED, onMediaAttached);
        hls.loadSource(props.url);
    }
    else {
        video.src = props.url;
        video.load();
    }
}

const fastSeek = (time: number) => {
    videoRef.value.currentTime = time;
}

const onCanPlay = () => {
    if (!hls && !canPlayEventFired.value) {
        if (props.initPlayTime > 0) {
            fastSeek(props.initPlayTime)
        }
        tryToAutoPlay()
    }
    canPlayEventFired.value = true
}

const onTimeUpdate = () => {
    emit('timeupdate', videoRef.value.currentTime)
}

const onEnded = () => {
    emit('ended')
}

const disposePlayer = () => {
    hls.off(Hls.Events.MANIFEST_PARSED, onMainfestParsed);
    hls.off(Hls.Events.MEDIA_ATTACHED, onMediaAttached);
    hls?.detachMedia();
    hls?.destroy();
}

onMounted(initPlayer)

watch(() => props.url, initPlayer)

onUnmounted(disposePlayer)
</script>
