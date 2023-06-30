<template>
    <div class="flex items-stretch p-2 gap-x-2 bg-white dark:bg-black shadow shadow-black/25 rounded">
        <slot name="leading" />
        <slot />
        <div class="self-center pr-2">
            <slot name="trailing" />
        </div>
    </div>
</template>
