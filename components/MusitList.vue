<template>
    <div class="w-full md:max-w-xl mx-auto">
        <div class="sticky top-0 h-10 leading-10 backdrop-blur-sm rounded text-sm pl-3 z-10">
            搜索到{{ data.length }}首歌曲</div>
        <div class="space-y-2 pb-2 px-2">
            <MusicPlayItem v-for="music in renderSongs" :key="music.id" :class="[
                isActiveMusic(music) && 'sticky z-20 top-10 bottom-0'
            ]" :music="music" :current="isActiveMusic(music)" :playState="playState" :error="hasError" @pause="pause"
                @play="play(music)" @seek="onSeek" />
            <div class="text-center" v-if="songPages > 1">
                <UButton block variant="soft" v-if="songPage < songPages" @click="loadMoreSongs">加载更多
                </UButton>
                <span v-else>已加载全部</span>
            </div>
        </div>
    </div>
    <audio ref="audioRef" v-if="playingMusic" :src="playingMusic.url" preload="auto" @play="onPlay" @pause="onPause"
        @durationchange="onDurationChange" @timeupdate="onTimeUpdate" @error="onError" loop />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const { showError } = useMessage()

const { data } = defineProps<{
    data: SearchMusic[];
}>()

const songPageSize = 20
const songPage = ref(1)
const hasError = ref(false)

const songPages = computed(() => Math.ceil(data.length / songPageSize))

const renderSongs = computed(() => data.slice(0, Math.min(songPage.value * songPageSize, data.length)))

const playState = reactive<PlayState>({
    playing: false,
    duration: 0,
    currentTime: 0
})

const playingMusic = ref<SearchMusic | null>(null)

const audioRef = shallowRef<HTMLAudioElement>()

const loadMoreSongs = () => {
    songPage.value += 1
}

const isActiveMusic = (music: SearchMusic) => {
    return playingMusic.value !== null && playingMusic.value.id === music.id
}

const tryToPlay = async () => {
    try {
        await audioRef.value.play()
    }
    catch (err) {
        console.warn(err)
    }
}

const showPlayFailError = () => showError('播放出错, 当前歌曲无法播放')

const play = async (music: SearchMusic) => {
    if (!playingMusic.value || playingMusic.value && playingMusic.value.id !== music.id) {
        audioRef.value?.pause()
        playingMusic.value = music
        await nextTick()
        audioRef.value.load()
    }
    else if (hasError.value) {
        showPlayFailError()
        return;
    }
    await tryToPlay()
}

const pause = async () => {
    audioRef.value.pause()
}

const onSeek = (time: number) => {
    if (audioRef.value) {
        audioRef.value.currentTime = time
    }
}

watch(playingMusic, () => {
    hasError.value = false
    playState.currentTime = 0
    playState.duration = 0
})

const onPlay = () => {
    playState.playing = true
}

const onPause = () => {
    playState.playing = false
}

const onDurationChange = () => {
    playState.duration = audioRef.value.duration
}

const onTimeUpdate = () => {
    playState.currentTime = audioRef.value.currentTime
}

const onError = () => {
    hasError.value = true
    playState.playing = false
    showPlayFailError()
}
</script>