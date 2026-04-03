<template>

    <Head>
        <Title>音乐/影视搜索</Title>
    </Head>
    <div class="flex flex-col h-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <div
            class="absolute z-30 left-0 top-0 flex justify-center items-center self-start w-full backdrop-blur-sm border-black/5 dark:border-white/5 space-x-2 p-3">
            <form name="search" class="flex w-full gap-2 sm:w-auto" @submit.prevent="onSearch">
                <USelect v-model="searchType" :items="searchTypes" value-key="value" :icon="icon" class="w-28" />
                <UInput class="grow sm:grow-0" v-model="keyword" :disabled="loading" ref="searchInputRef"
                    placeholder="输入关键词搜索.." :ui="{ trailing: 'pe-1' }">
                    <template v-if="keyword?.length" #trailing>
                        <UButton color="neutral" variant="link" size="sm" icon="i-heroicons-x-mark-20-solid"
                            @click="clearInput" />
                    </template>
                </UInput>
            </form>
        </div>
        <div class="h-full relative pt-14 overflow-y-auto" v-if="searchComplete">
            <template v-if="lastSearchType === SearchType.music">
                <song-list v-if="searchMusicResult.length > 0" :data="searchMusicResult" />
                <Overlay v-else-if="!loading" text="💔没有搜索到相关的音乐" />
            </template>
            <template v-else>
                <video-list v-if="searchVideoResult.length > 0" :data="searchVideoResult" />
                <Overlay v-else-if="!loading" text="💔没有搜索到相关的影视" />
            </template>
        </div>
        <div class="flex grow justify-center items-center" v-else-if="!loading">
            <p class="opacity-50">🔍输入关键词开始搜索</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, onMounted, unref } from 'vue'
import type { SelectItem } from '@nuxt/ui'
import { getParamsUrl } from '~/util/proxy'

enum SearchType {
    music = 0,
    video = 1
}

const searchTypes = ref([
    {
        value: SearchType.music,
        label: '音乐',
        icon: 'i-heroicons-musical-note-20-solid'
    },
    {
        value: SearchType.video,
        label: '影视',
        icon: 'i-heroicons-film'
    }
] satisfies SelectItem[])

const searchType = ref(searchTypes.value[0]?.value)
const icon = computed(() => searchTypes.value.find(item => item.value === searchType.value)?.icon)

const keyword = ref('')
const loading = ref(false)
const searchComplete = ref(false)

const searchInputRef = shallowRef<{
    inputRef: Ref<HTMLInputElement | null>;
}>()

const lastSearchType = ref<SearchType>(SearchType.music)

const searchMusicResult = ref<SearchMusic[]>([])

const searchVideoResult = ref<SearchVideo[]>([])

usePwa()

useLoading(loading)

const input = computed(() => {
    const { inputRef } = unref(searchInputRef)
    return unref(inputRef)
})

const clearInput = () => {
    keyword.value = ''
    input.value?.focus()
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
        if (searchType.value === SearchType.music) {
            const data = await getSearch<SearchMusic[]>('/api/music/list', query)
            searchMusicResult.value = data
        }
        else {
            const data = await getSearch<SearchVideo[]>('/api/video/list', query)
            searchVideoResult.value = data
        }
        lastSearchType.value = searchType.value
        searchComplete.value = true
    }
    catch (err) {
        showError(`[错误]${String(err)}`)
    }
}

const onSearch = async (_event: Event) => {
    if (!loading.value) {
        loading.value = true
        input.value?.blur()
        await getData(keyword.value)
        loading.value = false
    }
}
</script>