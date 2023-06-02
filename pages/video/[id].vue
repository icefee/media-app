<template>
    <div
        class="bg-gradient-to-r from-pink-200 via-purple-300 to-pink-300 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 h-full overflow-y-auto">
        <div class="max-w-7xl mx-auto bg-white dark:bg-gray-900 shadow-md" v-if="data">
            <div :style="{
                height: 'min(calc(min(100vw, 1200px) * 10 / 16), 600px)',
                maxHeight: '100vh'
            }">
                <VideoPlayer :url="playingVideo.url" hls />
            </div>
            <div class="p-3">
                <Tab :options="['简介', '选集']" v-model:value="activeView" />
            </div>
            <div class="flex p-2 space-x-2" v-if="activeView === 0">
                <div class="w-40 h-60 flex-shrink-0">
                    <ThumbLoader :src="videoData.pic" />
                </div>
                <div class="grow">
                    <h4 class="text-xl">{{ videoData.name }}</h4>
                    <p class="mb-2">{{ videoData.note }}</p>
                    <p v-if="videoData.subname">{{ videoData.note }}</p>
                    <p>类别: {{ videoData.type }}</p>
                    <p>年份: {{ videoData.year }}</p>
                    <p v-if="videoData.area">地区: {{ videoData.area }}</p>
                    <p v-if="videoData.director">导演: {{ videoData.director }}</p>
                    <p v-if="videoData.actor">演员: {{ videoData.actor }}</p>
                    <p v-if="videoData.actor">演员: {{ videoData.actor }}</p>
                    <p v-html="videoData.des" />
                </div>
            </div>
            <div class="flex flex-wrap p-2" v-if="activeView === 1">
                <div class="p-1 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6" v-for="video, index in videoData.dataList[0].urls"
                    :key="index">
                    <UButton :color="activeEpisode === index ? 'primary' : 'gray'" variant="solid" block
                        @click="activeEpisode = index">{{ video.label }}</UButton>
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

const { data, error, execute, refresh } = await useFetch<ApiJsonType<VideoInfo>>(`/api/video/${route.params.id}`)

const videoData = computed(() => data.value.data);

const playingVideo = computed(() => videoData.value.dataList[activeSource.value].urls[activeEpisode.value])

onMounted(execute)

</script>