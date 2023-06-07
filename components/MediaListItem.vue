<template>
    <div class="flex items-stretch p-2 gap-x-2 bg-white dark:bg-black shadow shadow-black/25 rounded">
        <slot name="leading" />
        <div class="flex flex-col justify-around overflow-hidden grow">
            <p class="whitespace-nowrap overflow-hidden text-ellipsis">{{ title }}</p>
            <p class="opacity-70 text-sm">{{ subtitle }}</p>
        </div>
        <div class="self-center pr-2">
            <slot name="trailing" />
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    title: string;
    subtitle: string;
}>()
</script>
