<template>
    <Head>
        <Title>影视搜索</Title>
    </Head>
    <div class="flex flex-col h-full bg-gray-200 dark:bg-gray-950 overflow-hidden">
        <div class="flex justify-center items-center self-start w-full space-x-2 p-3">
            <form @submit="onSearch">
                <UInput v-model="keyword" size="lg" placeholder="输入关键词搜索.." icon="i-heroicons-magnifying-glass-20-solid"
                    :ui="{ icon: { trailing: { pointer: '' } } }">
                    <template #trailing>
                        <UButton v-show="keyword !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid"
                            :padded="false" @click="keyword = ''" />
                    </template>
                </UInput>
            </form>
        </div>
        <div class="grow p-2 overflow-y-auto" v-if="searchComplete">
            <div class="mb-5" v-for="resultGroup in searchResult" :key="resultGroup.key">
                <div class="p-2">
                    <h4>{{ resultGroup.name }}</h4>
                </div>
                <div class="flex flex-wrap gap-3">
                    <div class="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4" v-for="video in resultGroup.data" :key="video.id">
                        <NuxtLink class="block" :href="videoUrl(resultGroup.key, video.id)" target="_blank">
                            <MediaCard :src="'/api' + videoUrl(resultGroup.key, video.id) + '?type=poster'"
                                :title="video.name" :subtitle="video.note" :type="video.type" :tail="video.last" />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex grow justify-center items-center" v-else>
            <p class="opacity-50">🔍输入关键词开始搜索</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Clue from '~/util/clue'

const keyword = ref('')
const loading = ref(false)
const searchComplete = ref(false)

const searchResult = ref<SearchVideo[]>([])

useLoading(loading)

const toast = useToast()

const getData = async (s: string) => {

    const searchParams = new URLSearchParams({
        s
    })
    try {
        const { code, data, msg } = await $fetch<ApiJsonType<SearchVideo[]>>(
            `/api/video/list?${searchParams}`
        )
        if (code === 0) {
            searchResult.value = data
            searchComplete.value = true
        }
        else {
            toast.add({
                color: 'red',
                title: `[错误]${msg}`
            })
        }
    }
    catch (err) {
        toast.add({
            color: 'red',
            title: '数据获取失败'
        })
    }
}

const videoUrl = (api: string, id: number | string) => {
    const sid = Clue.create(api, id)
    return `/video/${sid}`
}

const onSearch = async (ev: Event) => {

    ev.preventDefault();

    if (!loading.value) {
        loading.value = true
        await getData(keyword.value)
        loading.value = false
    }
}

</script>
