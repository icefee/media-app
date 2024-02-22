<template>
    <div class="relative h-full">
        <slot />
        <LoadingOverlay v-if="loading" />
    </div>
</template>

<script lang="ts" setup>
import { ref, provide } from 'vue'
import { provideLoading } from '~/util/keys'

const loading = ref(false)

const showLoading = () => {
    loading.value = true
}

const hideLoading = () => {
    loading.value = false
}

provide<LoadingModel>(provideLoading, {
    showLoading,
    hideLoading
})
</script>