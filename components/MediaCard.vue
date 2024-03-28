<template>
    <div class="flex rounded-md overflow-hidden bg-white dark:bg-slate-800 shadow-lg">
        <div class="w-28 h-40 flex-shrink-0">
            <ThumbLoader :src="src" :alt="title" />
        </div>
        <div class="flex flex-col space-y-2 grow p-2">
            <h3 class="text-xl text-primary-500">{{ title }}</h3>
            <div class="grow">
                <div class="flex items-center self-start space-x-2">
                    <UBadge :label="type" />
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ subtitle }}</span>
                </div>
            </div>
            <div class="flex justify-end">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ tail }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    src: string
    title: string;
    type: string;
    subtitle: string;
    tail?: string;
}>()
</script>