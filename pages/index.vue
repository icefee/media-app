<template>
    <Head>
        <Title>音乐/影视搜索</Title>
    </Head>
    <div class="flex flex-col h-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <div class="absolute z-30 left-0 top-0 flex justify-center items-center self-start w-full backdrop-blur-sm border-black/5 dark:border-white/5 space-x-2 p-3"
            :class="{
                'border-b': searchMusicResult.length > 0 || searchVideoResult.length > 0
            }">
            <form class="flex w-full sm:w-auto" @submit.prevent="onSearch">
                <USelectMenu v-model="searchType" size="lg" :disabled="loading" :options="searchTypes" class="shrink-0">
                    <template #label>
                        <UIcon :name="searchType.icon" class="w-4 h-4" />
                        {{ searchType.label }}
                    </template>
                </USelectMenu>
                <UInput v-model="keyword" ref="inputRef" :loading="loading" size="lg" placeholder="输入关键词搜索.."
                    icon="i-heroicons-magnifying-glass-20-solid" :ui="{
                        wrapper: 'relative grow sm:grow-0',
                        icon: {
                            trailing: {
                                pointer: ''
                            }
                        }
                    }">
                    <template #trailing>
                        <UButton v-show="keyword !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid"
                            :padded="false" @click="clearInput" />
                    </template>
                </UInput>
            </form>
        </div>
        <div class="h-full relative pt-16 overflow-y-auto" v-if="searchComplete">
            <template v-if="lastSearchType === SearchType.music">
                <template v-if="searchMusicResult.length > 0">
                    <div class="w-full md:max-w-xl mx-auto">
                        <div class="sticky top-0 h-10 leading-10 backdrop-blur-sm rounded text-sm pl-3 z-10">
                            搜索到{{ searchMusicResult.length }}首歌曲</div>
                        <div class="space-y-2 pb-2 px-2">
                            <MusicPlayItem v-for="music in searchMusicResult" :key="music.id" :class="[
                                isActiveMusic(music) && 'sticky z-20 top-10 bottom-0 bg-indigo-300'
                            ]" :music="music" :current="isActiveMusic(music)" :playState="playState" :error="hasError"
                                @pause="pause" @play="play(music)" @seek="onSeek" />
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
                                <a class="block" :href="`/video/play/${videoId(resultGroup.key, video.id)}`"
                                    target="_blank">
                                    <MediaCard :src="'/api' + videoUrl(resultGroup.key, video.id) + '?type=poster'"
                                        :title="video.name" :subtitle="video.note" :type="video.type" :tail="video.last" />
                                </a>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <Overlay text="💔没有搜索到相关的影视" />
                </template>
            </template>
        </div>
        <div class="flex grow justify-center items-center" v-else-if="!loading">
            <p class="opacity-50">🔍输入关键词开始搜索</p>
        </div>
        <audio ref="audioRef" v-if="searchComplete && lastSearchType === SearchType.music && playingMusic"
            :src="playingMusic.url" preload="auto" @play="onPlay" @pause="onPause" @durationchange="onDurationChange"
            @timeupdate="onTimeUpdate" @error="onError" loop />
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, shallowRef, nextTick, watch, onMounted } from 'vue'
import { Clue } from '~/util/clue'
import { getParamsUrl } from '~/util/proxy'

const keyword = ref('')
const loading = ref(false)
const searchComplete = ref(false)
const hasError = ref(false)

usePwa()

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

onMounted(() => {
    keyword.value = inputRef.value?.input.value
})

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

const getSearch = async <T = unknown>(url: string, query?: Record<string, string>) => {
    const { code, data, msg } = await $fetch<ApiJsonType<T>>(
        getParamsUrl(url, query)
    )
    if (code === 0) {
        return data
    }
    else {
        throw new Error(msg)
    }
}

const getData = async (s: string) => {
    try {
        const query = {
            s
        }
        if (searchType.value.type === SearchType.music) {
            const data = await getSearch<SearchMusic[]>('/api/music/list', query)
            searchMusicResult.value = data
            playingMusic.value = null
        }
        else {
            const data = await getSearch<SearchVideo[]>('/api/video/list', query)
            searchVideoResult.value = data
        }
        lastSearchType.value = searchType.value.type
        searchComplete.value = true
    }
    catch (err) {
        showError(`[错误]${String(err)}`)
    }
}

const videoId = (...args: Parameters<typeof Clue.create>) => Clue.create(...args)

const videoUrl = (...args: Parameters<typeof Clue.create>) => {
    const sid = videoId(...args)
    return `/video/${sid}`
}

const onSearch = async () => {
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
    playState.playing = false
    showPlayFailError()
}
</script>
