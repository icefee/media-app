<template>
    <Head>
        <Title>音乐/影视搜索</Title>
    </Head>
    <div class="flex flex-col h-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <div class="absolute z-30 left-0 top-0 flex justify-center items-center self-start w-full backdrop-blur-sm border-black/5 dark:border-white/5 space-x-2 p-3"
            :class="{
                'border-b': searchMusicResult.length > 0 || searchVideoResult.length > 0
            }">
            <form name="search" class="flex w-full sm:w-auto" @submit.prevent="onSearch">
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
                <song-list v-if="searchMusicResult.length > 0" :data="searchMusicResult" />
                <Overlay v-else text="💔没有搜索到相关的音乐" />
            </template>
            <template v-else>
                <video-list v-if="searchVideoResult.length > 0" :data="searchVideoResult" />
                <Overlay v-else text="💔没有搜索到相关的影视" />
            </template>
        </div>
        <div class="flex grow justify-center items-center" v-else-if="!loading">
            <p class="opacity-50">🔍输入关键词开始搜索</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, onMounted } from 'vue'
import { getParamsUrl } from '~/util/proxy'

usePwa()

useHeadSafe({
    meta: [
        {
            name: 'referrer',
            content: 'no-referrer'
        }
    ]
})

const { showError } = useMessage()

const keyword = ref('')
const loading = ref(false)
const searchComplete = ref(false)

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

const inputRef = shallowRef<{
    input: HTMLInputElement;
}>()

const lastSearchType = ref<SearchType>(SearchType.music)

const searchMusicResult = ref<SearchMusic[]>([])

const searchVideoResult = ref<SearchVideo[]>([])

useLoading(loading)

onMounted(() => {
    keyword.value = inputRef.value?.input.value
})

const clearInput = () => {
    keyword.value = ''
    inputRef.value?.input.focus()
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

const onSearch = async () => {
    if (!loading.value) {
        loading.value = true
        inputRef.value?.input.blur()
        await getData(keyword.value)
        loading.value = false
    }
}
</script>