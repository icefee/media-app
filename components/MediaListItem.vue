<template>
    <div class="flex items-stretch p-2 gap-x-2 shadow shadow-black/25 rounded"
        :class="active ? 'bg-indigo-300 dark:bg-indigo-500' : 'bg-white dark:bg-black'">
        <slot name="leading" />
        <slot />
        <div class="self-center">
            <slot name="trailing" />
        </div>
    </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
    active?: boolean;
}>(), {
    active: false
})
</script>
