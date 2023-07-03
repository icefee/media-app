<template>
    <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor"
            d="M2,12A11.2,11.2,0,0,1,13,1.05C12.67,1,12.34,1,12,1a11,11,0,0,0,0,22c.34,0,.67,0,1-.05C6,23,2,17.74,2,12Z">
            <animateTransform attributeName="transform" dur="0.6s" repeatCount="indefinite" type="rotate"
                values="0 12 12;360 12 12" />
        </path>
    </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    fill?: boolean;
}>(), {
    fill: false
})

const attrs = computed(() => props.fill ? {
    class: 'w-full h-full'
} : {
    style: {
        width: '1em',
        height: '1em'
    }
})
</script>
