<script setup lang="ts">
import type { BottomTab, BottomState } from '@/services'
import ResizableView from '@/components/ResizableView.vue'
import LogView from '@/components/LogView.vue'
import SerialportView from '@/components/SerialportView.vue'
import { bottomService } from '@/services'

const bottomState = ref<BottomState>()

function close() {
  bottomService.close()
}

function onUpdateTab(tab: BottomTab) {
  bottomService.switch(tab)
}

onMounted(() => {
  bottomState.value = bottomService.getState()

  // 订阅状态变化
  const subscription = bottomService.subscribeToState(newState => {
    bottomState.value = newState
  })

  onBeforeUnmount(() => {
    subscription.unsubscribe()
  })
})
</script>

<template>
  <ResizableView class="h-50" :class="bottomState?.visible ? '' : 'hidden'" edge="top" :min-size="200" :max-size="400">
    <n-tabs class="h-full" type="line" :value="bottomState?.activeTab" @update:value="onUpdateTab">
      <n-tab-pane class="!p-0 size-full overflow-y-auto" name="log" tab="日志" display-directive="show">
        <LogView />
      </n-tab-pane>
      <n-tab-pane class="!p-0 size-full overflow-y-auto" name="serialport" tab="串口" display-directive="show">
        <SerialportView />
      </n-tab-pane>
      <template #suffix>
        <div class="flex items-center gap-2">
          <span class="px-[2px] cursor-pointer" @click="close">
            <i-clarity-window-close-line class="size-6" />
          </span>
        </div>
      </template>
    </n-tabs>
  </ResizableView>
</template>
