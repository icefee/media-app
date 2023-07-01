<template>
    <Head>
        <Title>音乐/影视搜索</Title>
    </Head>
    <div class="flex flex-col h-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <div class="flex justify-center items-center self-start w-full space-x-2 p-3">
            <form class="flex" @submit.prevent="onSearch">
                <div class="shrink-0">
                    <USelectMenu v-model="searchType" size="lg" :options="searchTypes">
                        <template #label>
                            <UIcon :name="searchType.icon" class="w-4 h-4" />
                            {{ searchType.label }}
                        </template>
                    </USelectMenu>
                </div>
                <UInput v-model="keyword" ref="inputRef" size="lg" placeholder="输入关键词搜索.."
                    icon="i-heroicons-magnifying-glass-20-solid" :ui="{ icon: { trailing: { pointer: '' } } }">
                    <template #trailing>
                        <UButton v-show="keyword !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid"
                            :padded="false" @click="clearInput" />
                    </template>
                </UInput>
            </form>
        </div>
        <div class="grow relative overflow-y-auto" v-if="searchComplete">
            <template v-if="lastSearchType === SearchType.music">
                <template v-if="searchMusicResult.length > 0">
                    <div class="w-full md:max-w-xl mx-auto">
                        <div class="sticky top-0 p-3 backdrop-blur-sm rounded text-sm z-10">
                            搜索到{{ searchMusicResult.length }}首歌曲</div>
                        <div class="space-y-2 pb-2 px-2">
                            <MusicPlayItem v-for="music in searchMusicResult" :key="music.id" :music="music"
                                :current="isActiveMusic(music)" :playState="playState" :error="hasError" @pause="pause"
                                @play="play(music)" @seek="onSeek" />
                        </div>
                    </div>
                </template>
                <template v-else>
                    <Overlay text="💔没有搜索到相关的音乐" />
                </template>
            </template>
            <template v-else>
                <template v-if="searchVideoResult.length > 0">
                    <div class="mb-5" v-for="resultGroup in searchVideoResult" :key="resultGroup.key">
                        <div class="sticky top-0 backdrop-blur-sm pl-4 py-3">
                            <h4>{{ resultGroup.name }}</h4>
                        </div>
                        <div class="flex flex-wrap px-2">
                            <div class="w-full p-2 sm:w-1/2 lg:w-1/3 xl:w-1/4" v-for="video in resultGroup.data"
                                :key="video.id">
                                <NuxtLink class="block" :href="`/video-play/?id=${videoId(resultGroup.key, video.id)}`"
                                    target="_blank">
                                    <MediaCard :src="'/api' + videoUrl(resultGroup.key, video.id) + '?type=poster'"
                                        :title="video.name" :subtitle="video.note" :type="video.type" :tail="video.last" />
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <Overlay text="💔没有搜索到相关的影视" />
                </template>
            </template>
        </div>
        <div class="flex grow justify-center items-center" v-else>
            <p class="opacity-50">🔍输入关键词开始搜索</p>
        </div>
        <div class="absolute w-0 h-0 overflow-hidden -z-50">
            <audio ref="audioRef" v-if="searchComplete && lastSearchType === SearchType.music && playingMusic"
                :src="playingMusic.url" preload="auto" @play="onPlay" @pause="onPause" @durationchange="onDurationChange"
                @timeupdate="onTimeUpdate" @error="onError" loop />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, shallowRef, nextTick, watch } from 'vue'
import Clue from '~/util/clue'

const keyword = ref('')
const loading = ref(false)
const searchComplete = ref(false)
const hasError = ref(false)

enum SearchType {
    music = 0,
    video = 1
}

const searchTypes = [
    {
        type: SearchType.music,
        label: '音乐',
        icon: 'i-heroicons-musical-note-20-solid'
    },
    {
        type: SearchType.video,
        label: '影视',
        icon: 'i-heroicons-film'
    }
]

const searchType = ref(searchTypes[0])

const lastSearchType = ref<SearchType>(SearchType.music)

const searchMusicResult = ref<SearchMusic[]>([])

const inputRef = shallowRef<{
    input: HTMLInputElement;
}>()

const audioRef = shallowRef<HTMLAudioElement>()

const playState = reactive<PlayState>({
    playing: false,
    duration: 0,
    currentTime: 0
})

const playingMusic = ref<SearchMusic>()

const searchVideoResult = ref<SearchVideo[]>([])

useLoading(loading)

const toast = useToast()

const clearInput = () => {
    keyword.value = ''
    inputRef.value?.input.focus()
}

const showError = (errText: string) => {
    toast.add({
        color: 'red',
        icon: 'i-heroicons-x-circle-20-solid',
        title: errText
    })
}

const getData = async (s: string) => {

    const searchParams = new URLSearchParams({
        s
    })
    try {
        if (searchType.value.type === SearchType.music) {
            const { code, data, msg } = await $fetch<ApiJsonType<SearchMusic[]>>(
                `/api/music/list?${searchParams}`
            )
            if (code === 0) {
                searchMusicResult.value = data
                searchComplete.value = true
                lastSearchType.value = SearchType.music
                playingMusic.value = null
            }
            else {
                throw new Error(msg)
            }
        }
        else {
            const { code, data, msg } = await $fetch<ApiJsonType<SearchVideo[]>>(
                `/api/video/list?${searchParams}`
            )
            if (code === 0) {
                searchVideoResult.value = data
                searchComplete.value = true
                lastSearchType.value = SearchType.video
            }
            else {
                throw new Error(msg)
            }
        }
    }
    catch (err) {
        showError(`[错误]${String(err)}`)
    }
}

const videoId = (api: string, id: number | string) => Clue.create(api, id)

const videoUrl = (api: string, id: number | string) => {
    const sid = videoId(api, id)
    return `/video/${sid}`
}

const onSearch = async (ev: Event) => {
    if (!loading.value) {
        loading.value = true
        await getData(keyword.value)
        loading.value = false
    }
}

watch(playingMusic, () => {
    hasError.value = false
    playState.currentTime = 0
    playState.duration = 0
})

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

const onSeek = (time: number) => {
    if (audioRef.value) {
        audioRef.value.currentTime = time
    }
}

const pause = async () => {
    audioRef.value.pause()
}

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
    showPlayFailError()
}
</script>
