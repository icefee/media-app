<template>
    <div class="block w-full h-full bg-black" ref="container" />
</template>

<script lang="ts" setup>
import { shallowRef, onMounted, onUnmounted, watch } from 'vue'
import Artplayer from 'artplayer'
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

const container = shallowRef<HTMLDivElement>()

let player: Artplayer | null = null;
let hls: Hls | null = null;

const initPlayer = () => {
    const { url, autoplay, initPlayTime } = props;
    player = new Artplayer({
        container: container.value,
        autoplay,
        theme: '#a78bfa',
        pip: true,
        fullscreen: true,
        fullscreenWeb: true,
        miniProgressBar: true,
        url,
        customType: {
            m3u8(video: HTMLVideoElement, url: string) {
                if (Hls.isSupported()) {
                    hls = new Hls({
                        autoStartLoad: false
                    })
                    hls.loadSource(url)
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        hls.startLoad(initPlayTime)
                    })
                    hls.attachMedia(video)
                } else {
                    const canPlay = video.canPlayType(
                        'application/vnd.apple.mpegurl'
                    )
                    if (canPlay === 'probably' || canPlay == 'maybe') {
                        video.src = url;
                    } else {
                        player.notice.show = '不支持的播放格式'
                    }
                }
            }
        }
    })
    player.on('video:timeupdate', () => emit('timeupdate', player.currentTime))
    player.on('video:ended', () => emit('ended'))
}

const disposePlayer = () => {
    player.destroy(false)
}

onMounted(initPlayer)

watch(() => props.url, () => {
    player.switchUrl(props.url)
})

onUnmounted(disposePlayer)
</script>
