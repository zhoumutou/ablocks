<script setup lang="ts">
import type { HeaderTeleports } from '@/config'
import { environment } from '@/utils'
import TittleBar from '@/components/TittleBar.vue'
import WindowButtons from '@/components/WindowButtons.vue'
import AppMenu from '@/components/AppMenu.vue'

const left = ref<HTMLElement>()
const right = ref<HTMLElement>()

function getTeleports(): HeaderTeleports {
  return {
    left: left.value,
    right: right.value,
  }
}

defineExpose({ getTeleports })
</script>

<template>
  <header class="top-0 sticky bg-white shadow-2xs shadow-gray-200 z-999">
    <TittleBar :observe="environment.electron">
      <template #left>
        <div class="flex items-center">
          <div v-if="!environment.mac || !environment.electron" class="mr-2">
            <i-ab-logo class="size-6" />
          </div>
          <div v-else class="w-16" />
          <AppMenu />
          <div ref="left" />
        </div>
      </template>

      <template #right>
        <div class="flex">
          <div ref="right" />
          <WindowButtons v-if="environment.electron && !environment.mac" />
        </div>
      </template>
    </TittleBar>
  </header>
</template>
