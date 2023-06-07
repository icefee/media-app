<template>
    <div class="flex items-stretch p-2 gap-x-2 bg-white dark:bg-black shadow shadow-black/25 rounded">
        <UAvatar class="shrink-0" :src="src" size="xl" />
        <div class="flex flex-col justify-around overflow-hidden grow">
            <p class="whitespace-nowrap overflow-hidden text-ellipsis">{{ title }}</p>
            <p class="opacity-70 text-sm">{{ subtitle }}</p>
        </div>
        <div class="self-center pr-2">
            <slot name="tail" />
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    src: string;
    title: string;
    subtitle: string;
}>()
</script>
