<template>
  <LayoutBase>
    <div class="h-screen flex flex-col overflow-hidden">
      <AppHeader ref="header" />
      <AppMain class="flex-1 flex flex-col overflow-hidden">
        <router-view />
      </AppMain>
    </div>
  </LayoutBase>
</template>

<script setup lang="ts">
import type { HeaderTeleports } from '@/config'
import LayoutBase from './LayoutBase.vue'
import AppHeader from './AppHeader.vue'
import AppMain from './AppMain.vue'
import { provideHeaderTeleports } from '@/hooks/useTeleports'

const header = ref<InstanceType<typeof AppHeader>>()
const headerTeleports = ref<HeaderTeleports>()

onMounted(() => {
  headerTeleports.value = header.value?.getTeleports()
})

provideHeaderTeleports(headerTeleports)
</script>
