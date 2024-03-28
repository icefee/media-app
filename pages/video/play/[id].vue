<template>
    <Head>
        <Title>{{ videoData ? videoData.name : error ? '数据加载失败' : '加载中..' }}</Title>
    </Head>
    <div
        class="bg-gradient-to-tr from-indigo-200 to-violet-300 dark:from-indigo-500 dark:to-blue-500 h-full overflow-hidden">
        <div class="flex flex-col sm:block max-w-6xl h-full mx-auto overflow-hidden bg-white dark:bg-black shadow-lg shadow-black sm:overflow-y-auto"
            v-if="videoData">
            <div :style="{
            height: 'clamp(40%, calc(min(100vw, 1152px) * .625), 600px)'
        }" class="relative max-h-screen bg-black grow-0 shrink-0">
                <iframe class="block w-full h-full border-none opacity-0" :class="{
            'opacity-100': playerLoaded
        }" :key="activeEpisode" :src="getPlayerUrl(playingVideo.url, videoData.proxy)" allow="fullscreen; autoplay"
                    @load="onPlayerLoaded" />
                <LoadingOverlay :backdrop="false" :background="false" v-if="!playerLoaded" />
            </div>
            <div class="p-3 text-center border-b border-gray-200 dark:border-gray-900">
                <span>{{ videoData.name }} - {{ playList[activeEpisode].label }}</span>
            </div>
            <div class="px-2 pt-2 grow overflow-y-auto sm:grow-0 sm:overflow-hidden">
                <UTabs :items="[{ label: '简介', slot: 'profile' }, { label: '选集', slot: 'series' }]" :ui="{
            wrapper: 'relative space-y-2 flex flex-col h-full overflow-hidden',
            container: 'relative grow-1 overflow-hidden',
            base: 'h-full sm:h-auto'
        }">
                    <template #profile>
                        <div class="flex space-x-2 pb-4 h-full">
                            <div class="w-32 sm:w-40 md:w-48 h-48 sm:h-60 md:h-72 flex-shrink-0">
                                <ThumbLoader :src="posterUrl" :alt="videoData.name" />
                            </div>
                            <div class="grow pb-5 overflow-y-auto">
                                <h4 class="text-2xl text-primary">{{ videoData.name }}</h4>
                                <p class="mb-2">{{ videoData.note }}</p>
                                <p v-if="videoData.subname">又名: {{ videoData.subname }}</p>
                                <p>类别: {{ videoData.type }}</p>
                                <p>年份: {{ videoData.year }}</p>
                                <p v-if="videoData.area">地区: {{ videoData.area }}</p>
                                <p v-if="videoData.director">导演: {{ videoData.director }}</p>
                                <p v-if="videoData.actor">演员: {{ videoData.actor }}</p>
                                <p v-html="videoData.des" />
                            </div>
                        </div>
                    </template>
                    <template #series>
                        <div class="h-full overflow-y-auto">
                            <div class="pb-5 min-h-[250px]">
                                <div class="flex flex-wrap">
                                    <div class="p-1 w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/8"
                                        v-for="video, index in playList" :key="index">
                                        <UButton :color="activeEpisode === index ? 'primary' : 'gray'" size="md"
                                            variant="solid" block @click="updateEpisode(index)">{{ video.label }}
                                        </UButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </UTabs>
            </div>
        </div>
        <div class="flex h-full justify-center items-center" v-else-if="error">
            <div class="flex flex-col justify-center items-center gap-2">
                <p>数据加载失败</p>
                <UButton @click="reloadData">重试</UButton>
            </div>
        </div>
        <LoadingOverlay :backdrop="false" v-else />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { proxyUrl, proxyHlsUrl, getParamsUrl } from '~/util/proxy'
import { Api } from '~/util/config'

const activeSource = ref(0)
const activeEpisode = ref(0)
const playerLoaded = ref(false)

const currentPlayTime = ref(0)

interface CachedParams {
    episode: number;
    seek: number;
}

const route = useRoute()

const createDefaultCacheParams = (): CachedParams => ({
    episode: 0,
    seek: 0
})

const videoId = <string>route.params.id;

const getCatchParams = () => {
    try {
        const storage = localStorage.getItem(videoId)
        if (storage) {
            const params: CachedParams = JSON.parse(storage)
            return params
        }
        throw new Error('no cached params')
    }
    catch (err) {
        return createDefaultCacheParams()
    }
}

const setCatchParams = (value: CachedParams) => {
    localStorage.setItem(videoId, JSON.stringify(value))
}

const { data, error, execute, refresh } = await useFetch<ApiJsonType<VideoInfo>>(
    `/api/video/${videoId}`,
    {
        immediate: false
    }
)

const videoData = computed(() => data.value?.data)
const playList = computed(() => videoData.value?.dataList[activeSource.value].urls)
const playingVideo = computed(() => playList.value?.[activeEpisode.value])

const posterUrl = computed(() => proxyUrl(videoData.value.pic))

const isLastEpisode = computed(() => activeEpisode.value === playList.value.length - 1)

const onPlayerLoaded = (event: Event) => {
    const frame = event.target as HTMLIFrameElement
    frame.focus()
    playerLoaded.value = true
}

const getPlayerUrl = (url: string, proxy: boolean) => {
    const seek = currentPlayTime.value + ''
    const params: Record<string, string> = {
        seek
    }
    if (proxy) {
        params.url = proxyHlsUrl(url)
        params.proxy = '1'
    }
    else {
        params.url = url
    }
    if (!isLastEpisode.value) {
        params.next = '1'
    }
    return getParamsUrl(`${Api.assetSite}/video/player`, params)
}

const updateEpisode = (index: number) => {
    if (activeEpisode.value !== index) {
        currentPlayTime.value = 0
        activeEpisode.value = index
        playerLoaded.value = false
        setCatchParams({
            seek: 0,
            episode: index
        })
    }
}

const playNext = () => updateEpisode(activeEpisode.value + 1)

const reloadData = () => {
    refresh()
    error.value = null
}

const bindPlayerEventHandler = () => {
    window.addEventListener('message', (event: MessageEvent<{
        type: VideoPlayerEvent;
        params?: VideoPlayState;
    }>) => {
        const { type, params } = event.data
        switch (type) {
            case 'play-next':
                playNext()
                break;
            case 'play-end':
                if (!isLastEpisode.value) {
                    playNext()
                }
                break;
            case 'play-time-update':
                const { progress, duration } = params
                setCatchParams({
                    episode: activeEpisode.value,
                    seek: progress * duration
                })
                break;
            default:
                break;
        }
    })
}

onMounted(() => {
    execute()
    const { episode, seek } = getCatchParams()
    activeEpisode.value = episode
    currentPlayTime.value = seek
    bindPlayerEventHandler()
})
</script>