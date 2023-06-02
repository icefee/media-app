<template>
    <div class="flex justify-center space-x-2">
        <UButton v-for="option, index in options" :key="index" :color="index === value ? 'primary' : 'gray'" variant="solid"
            @click="handleChange(index)">
            {{ option }}
        </UButton>
    </div>
</template>

<script lang="ts" setup>

defineProps<{
    options: string[];
    value: number;
}>()

const emit = defineEmits<{
    (e: 'update:value', value: number): void
}>()

function handleChange(index: number) {
    emit('update:value', index)
}
</script>
