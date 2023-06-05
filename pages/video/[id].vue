<template>
    <Head>
        <Title>{{ videoData ? videoData.name : error ? '数据加载失败' : '加载中' }}</Title>
    </Head>
    <div
        class="bg-gradient-to-r from-pink-200 via-purple-300 to-pink-300 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 h-full overflow-y-auto">
        <div class="max-w-7xl min-h-full mx-auto bg-white dark:bg-gray-950 shadow-md" v-if="data">
            <div :style="{
                height: 'min(calc(min(100vw, 1200px) * 10 / 16), 600px)',
                maxHeight: '100vh'
            }">
                <VideoPlayer autoplay :url="playingVideo.url" :init-play-time="initPlayTime" hls @timeupdate="onTimeUpdate"
                    @ended="onEnded" />
            </div>
            <div class="p-3">
                <Tab :options="['简介', '选集']" v-model:value="activeView" />
            </div>
            <div class="flex p-2 min space-x-2" v-if="activeView === 0">
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
            <div class="flex flex-wrap p-2" :style="{ minHeight: '250px' }" v-if="activeView === 1">
                <div class="p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
                    v-for="video, index in videoData.dataList[0].urls" :key="index">
                    <UButton :color="activeEpisode === index ? 'primary' : 'gray'" variant="solid" block
                        @click="updateEpisode(index)">{{ video.label }}</UButton>
                </div>
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

const activeView = ref(0)
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
    if (activeEpisode.value < playList.value.length) {
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