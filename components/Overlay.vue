<template>
    <div class="absolute inset-0 flex justify-center items-center">
        <span>{{ text }}</span>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    text: string;
}

defineProps<Props>()
</script>