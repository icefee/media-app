<template>
    <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <defs>
            <linearGradient :id="rndId" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#a78bfa" />
                <stop offset="100%" stop-color="#03a9f4" />
            </linearGradient>
        </defs>
        <rect width="2.8" height="12" x="1" y="6" :fill="fillStyle">
            <animate id="svgSpinnersBarsScale0" attributeName="y" begin="0;svgSpinnersBarsScale1.end-0.1s"
                calcMode="spline" dur="0.6s" keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6" />
            <animate attributeName="height" begin="0;svgSpinnersBarsScale1.end-0.1s" calcMode="spline" dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12" />
        </rect>
        <rect width="2.8" height="12" x="5.8" y="6" :fill="fillStyle">
            <animate attributeName="y" begin="svgSpinnersBarsScale0.begin+0.1s" calcMode="spline" dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6" />
            <animate attributeName="height" begin="svgSpinnersBarsScale0.begin+0.1s" calcMode="spline" dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12" />
        </rect>
        <rect width="2.8" height="12" x="10.6" y="6" :fill="fillStyle">
            <animate attributeName="y" begin="svgSpinnersBarsScale0.begin+0.2s" calcMode="spline" dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6" />
            <animate attributeName="height" begin="svgSpinnersBarsScale0.begin+0.2s" calcMode="spline" dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12" />
        </rect>
        <rect width="2.8" height="12" x="15.4" y="6" :fill="fillStyle">
            <animate attributeName="y" begin="svgSpinnersBarsScale0.begin+0.3s" calcMode="spline" dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6" />
            <animate attributeName="height" begin="svgSpinnersBarsScale0.begin+0.3s" calcMode="spline" dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12" />
        </rect>
        <rect width="2.8" height="12" x="20.2" y="6" :fill="fillStyle">
            <animate id="svgSpinnersBarsScale1" attributeName="y" begin="svgSpinnersBarsScale0.begin+0.4s"
                calcMode="spline" dur="0.6s" keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6" />
            <animate attributeName="height" begin="svgSpinnersBarsScale0.begin+0.4s" calcMode="spline" dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12" />
        </rect>
    </svg>
</template>

<script lang="ts" setup>
import { computed, shallowRef } from 'vue'

const rndId = shallowRef(`line-gradient-spinner`)
const fillStyle = shallowRef(`url(#${rndId.value})`)

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