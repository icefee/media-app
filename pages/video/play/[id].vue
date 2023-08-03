<template>
    <Head>
        <Title>{{ videoData ? videoData.name : error ? '数据加载失败' : '加载中' }}</Title>
    </Head>
    <div class="bg-gradient-to-tr from-purple-300 to-pink-300 dark:from-indigo-500 dark:to-blue-500 h-full overflow-hidden">
        <div class="flex flex-col sm:block max-w-5xl h-full mx-auto overflow-hidden bg-white dark:bg-black shadow-md shadow-black sm:overflow-y-auto"
            v-if="data">
            <div :style="{
                height: 'clamp(45%, calc(min(100vw, 1024px) * 10 / 16), 500px)'
            }" class="max-h-screen grow-0 shrink-0">
                <VideoPlayer autoplay :url="playingVideo.url" :init-play-time="initPlayTime" hls @timeupdate="onTimeUpdate"
                    @ended="onEnded" />
            </div>
            <div class="p-3 text-center border-b border-gray-200 dark:border-gray-900">
                <span>{{ videoData.name }} - {{ playList[activeEpisode].label }}</span>
            </div>
            <div class="p-2 grow overflow-y-auto sm:grow-0 sm:overflow-hidden">
                <UTabs :items="[{ label: '简介', slot: 'profile' }, { label: '选集', slot: 'series' }]" :ui="{
                    wrapper: 'relative space-y-2 flex flex-col h-full overflow-hidden',
                    container: 'relative grow-1 overflow-y-auto'
                }">
                    <template #profile>
                        <div class="flex space-x-2">
                            <div class="w-40 h-60 flex-shrink-0">
                                <ThumbLoader :src="videoData.pic" />
                            </div>
                            <div class="grow">
                                <h4 class="text-2xl">{{ videoData.name }}</h4>
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
                        <div class="p-2" :style="{ minHeight: '250px' }">
                            <div class="flex flex-wrap">
                                <div class="p-1 w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/8"
                                    v-for="video, index in videoData.dataList[0].urls" :key="index">
                                    <UButton :color="activeEpisode === index ? 'primary' : 'gray'" size="md" variant="solid"
                                        block @click="updateEpisode(index)">{{ video.label }}</UButton>
                                </div>
                            </div>
                        </div>
                    </template>
                </UTabs>
            </div>
        </div>
        <div class="flex h-full justify-center items-center" v-else-if="error">
            <div class="flex flex-col justify-center items-center gap-4">
                <p>数据加载失败</p>
                <UButton @click="refresh">重试</UButton>
            </div>
        </div>
        <LoadingOverlay v-else />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
const route = useRoute()

const activeSource = ref(0)
const activeEpisode = ref(0)

const initPlayTime = ref(0)

interface CatchedParams {
    episode: number;
    initPlayTime: number;
}

const videoId = <string>route.params.id;

const getCatchedParams = (id: string) => {
    try {
        const { episode, initPlayTime } = JSON.parse(
            localStorage.getItem(id)
        ) as CatchedParams
        return {
            episode,
            initPlayTime
        }
    }
    catch (err) {
        return null;
    }
}

const setCatchedParams = (id: string, value: Partial<ReturnType<typeof getCatchedParams>>) => {
    const params = getCatchedParams(id)
    localStorage.setItem(id, JSON.stringify({
        ...params,
        ...value
    }))
}

const { data, error, execute, refresh } = await useFetch<ApiJsonType<VideoInfo>>(`/api/video/${videoId}`, {
    immediate: false
})

const videoData = computed(() => data.value?.data)
const playList = computed(() => videoData.value?.dataList[activeSource.value].urls)
const playingVideo = computed(() => playList.value?.[activeEpisode.value])

const updateEpisode = (index: number) => {
    activeEpisode.value = index;
    initPlayTime.value = 0;
    setCatchedParams(videoId, {
        episode: index
    })
}

const onTimeUpdate = (playTime: number) => {
    setCatchedParams(videoId, {
        initPlayTime: playTime,
        episode: activeEpisode.value
    })
}

const onEnded = () => {
    if (activeEpisode.value < playList.value.length - 1) {
        updateEpisode(activeEpisode.value + 1)
    }
}

onMounted(() => {

    execute()

    const params = getCatchedParams(videoId)
    if (params) {
        activeEpisode.value = params.episode ?? 0;
        initPlayTime.value = params.initPlayTime ?? 0;
    }
})
</script>