<template>
    <div class="absolute flex justify-center items-center inset-0 z-[100]" :class="{
        'bg-black/25': backdrop
    }">
        <div class="flex items-center p-3 space-x-4" :class="[background && 'rounded bg-black/75']">
            <Spinner class="text-3xl text-primary-500 dark:text-primary-400" />
            <span class="bg-clip-text text-transparent bg-gradient-to-t from-cyan-300 to-purple-400">{{ text }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
    backdrop?: boolean;
    background?: boolean;
    text?: string;
}>(), {
    backdrop: true,
    background: true,
    text: '加载中..'
})
</script>