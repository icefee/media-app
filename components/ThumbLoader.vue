<template>
    <div class="w-full h-full">
        <USkeleton v-if="loading" class="w-full h-full rounded-none" />
        <img v-else class="block w-full h-full object-cover" :src="displayImageUrl" loading="lazy" :alt="alt" />
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue'

const loading = ref(true)
const failed = ref(false)

const props = defineProps<{
    src: string;
    alt?: string;
}>()

function loadImage() {
    failed.value = false
    const image = new Image()
    image.src = props.src
    image.onload = () => {
        loading.value = false
    }
    image.onerror = () => {
        loading.value = false
        failed.value = true
    }
}

const displayImageUrl = computed(
    () => failed.value ? '/image_fail.jpg' : props.src
)

onMounted(loadImage)

watch(() => props.src, loadImage)
</script>
