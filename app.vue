<template>
  <NuxtLayout>
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>

<style>
:root {
  --scrollbar-thumb-color: rgba(0, 0, 0, .5);
  --scrollbar-thumb-hover-color: rgba(0, 0, 0, .75);
  --scrollbar-thumb-dark-mode-color: hsl(0 0% 100% / 50%);
  --scrollbar-thumb-dark-mode-hover-color: hsl(0 0% 100% / 75%);
}

::-webkit-scrollbar {
  width: 4px;
  height: 8px;
}

::-webkit-scrollbar-corner,
::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb-color);
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover-color);
}

@media screen and (max-width: 600px) {
  ::-webkit-scrollbar {
    width: 2px;
    height: 2px;
  }
}

@media screen and (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-thumb-dark-mode-color);
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: var(--scrollbar-thumb-dark-mode-hover-color);
  }
}

html,
body,
#__nuxt {
  height: 100%;
}
</style>
