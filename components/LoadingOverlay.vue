<template>
    <div class="absolute flex justify-center items-center inset-0 z-[100]" :class="{
        'bg-black/25': backdrop
    }">
        <div class="flex items-center rounded p-3 space-x-2 bg-black/75 text-white">
            <Spinner class="text-4xl text-primary-500 dark:text-primary-400" />
            <span>加载中..</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
    backdrop?: boolean
}>(), {
    backdrop: true
})
</script>