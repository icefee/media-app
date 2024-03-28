<template>
    <div class="mb-5" v-for="resultGroup in data" :key="resultGroup.key">
        <div class="sticky top-0 z-20 backdrop-blur-sm pl-4 py-3">
            <h4>{{ resultGroup.name }}</h4>
        </div>
        <div class="flex flex-wrap px-2">
            <div class="w-full p-2 sm:w-1/2 lg:w-1/3 xl:w-1/4" v-for="video in resultGroup.data" :key="video.id">
                <a class="block" :href="`/video/play/${videoId(resultGroup.key, video.id)}`" target="_blank">
                    <MediaCard :src="'/api' + videoUrl(resultGroup.key, video.id) + '?type=poster'" :title="video.name"
                        :subtitle="video.note" :type="video.type" :tail="video.last" />
                </a>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Clue } from '~/util/clue'

const { data } = defineProps<{
    data: SearchVideo[];
}>()

const videoId: typeof Clue.create = (...args) => Clue.create(...args)

const videoUrl: typeof Clue.create = (...args) => {
    const sid = videoId(...args)
    return `/video/${sid}`
}
</script>