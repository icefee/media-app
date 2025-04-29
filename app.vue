<template>
  <NuxtLayout>
    <UApp :locale="zh_cn">
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { zh_cn } from '@nuxt/ui/locale'
</script>