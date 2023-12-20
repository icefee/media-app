<template>
    <MediaListItem :title="music.name" :subtitle="music.artist">
        <template #leading>
            <div class="relative flex items-center shrink-0">
                <div class="rounded-md w-14 h-14 md:w-16 md:h-16 shadow-md flex-grow-0 flex-shrink-0 transition-opacity overflow-hidden"
                    :class="{
                        'brightness-50': current
                    }">
                    <img class="block max-w-full object-cover" :src="music.poster" @error="onImageLoadError" />
                </div>
                <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary"
                    v-if="current && isMediaReady">
                    <MusicPlaying fontSize="24px" :animating="playState.playing" />
                </div>
                <div class="absolute flex justify-center items-center inset-0" v-if="current && !isMediaReady && !error">
                    <Spinner class="text-primary-500 text-2xl dark:text-primary-400" />
                </div>
            </div>
        </template>
        <div class="flex flex-col overflow-hidden grow" :class="{
            'justify-between': current
        }">
            <div class="flex" :class="current ? 'gap-x-2' : 'h-full flex-col justify-around'">
                <p class="whitespace-nowrap overflow-hidden text-ellipsis">{{ music.name }}</p>
                <p class="opacity-70 text-sm" :class="{
                    'self-end': current
                }">{{ music.artist }}</p>
            </div>
            <div class="flex items-center gap-x-2 pr-1" v-if="current">
                <span class="text-sm shrink-0">{{ durationText }}</span>
                <URange size="sm" :max="1" :step=".000001" :disabled="!isMediaReady" :model-value="rangeValue"
                    @update:model-value="onRangeChange" />
            </div>
        </div>
        <template #trailing>
            <UButton v-if="current && playState.playing" icon="i-heroicons-pause-20-solid" size="xl" variant="link"
                @click="$emit('pause')" />
            <UButton v-else icon="i-heroicons-play-20-solid" size="xl" variant="link" @click="$emit('play')" />
        </template>
    </MediaListItem>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { timeFormatter } from '~/util/date'

interface PropsType {
    music: SearchMusic;
    current: boolean;
    playState: PlayState;
    error?: boolean;
}

interface EmitsType {
    (e: 'play'): void;
    (e: 'pause'): void;
    (e: 'seek', time: number): void;
}

const { playState } = defineProps<PropsType>()
const emit = defineEmits<EmitsType>()

const isMediaReady = computed(() => !Number.isNaN(playState.duration) && playState.duration > 0)

const rangeValue = computed(() => {
    if (isMediaReady.value) {
        return playState.currentTime / playState.duration
    }
    return 0
})

const durationText = computed(() => {
    return [
        playState.currentTime,
        isMediaReady.value ? playState.duration : 0
    ].map(timeFormatter).join(' / ')
})

const onRangeChange = (value: number) => emit('seek', value * playState.duration)

const onImageLoadError = (event: Event) => {
    const image = event.target as HTMLImageElement
    image.src = '/poster.jpg'
}
</script>
