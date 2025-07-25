<script setup lang="ts">
import type { CodeState } from '@/services'
import { useHeaderTeleports } from '@/hooks/useTeleports'
import ResizableView from '@/components/ResizableView.vue'
import BlocklyView from '@/components/blockly/BlocklyView.vue'
import CodeView from '@/components/CodeView.vue'
import BottomView from './BottomView.vue'
import { logService, serialportService, codeService } from '@/services'
import blocklyService from '@/services/blockly'

const router = useRouter()
const headerTeleports = useHeaderTeleports()

const codeState = ref<CodeState>()
const blocklyRef = ref<InstanceType<typeof BlocklyView>>()
const loading = ref(false)

async function onSaveWorkspace() {
  if (!blocklyRef.value) {
    return
  }

  const workspace = blocklyRef.value.getWorkspace()
  if (!workspace) {
    return
  }

  loading.value = true
  await blocklyService.saveWorkspace(workspace)
  loading.value = false
}

async function onOpenWorkspace() {
  if (!blocklyRef.value) {
    return
  }

  const workspace = blocklyRef.value.getWorkspace()
  if (!workspace) {
    return
  }

  loading.value = true
  await blocklyService.openWorkspace(workspace)
  loading.value = false
}

function onToogleLog() {
  logService.toggle()
}

function onToggleSerialport() {
  serialportService.toggle()
}

function onToggleCode() {
  codeService.toggle()
}

function onLinkTest() {
  router.push({ name: 'test' })
}

onMounted(() => {
  codeState.value = codeService.getState()

  // 订阅状态变化
  const subscription = codeService.subscribeToState(newState => {
    codeState.value = newState
  })

  onBeforeUnmount(() => {
    subscription.unsubscribe()
  })
})
</script>

<template>
  <div class="h-full flex-1 flex flex-col relative">
    <div class="p-3 flex gap-3">
      <n-button :disabled="loading" @click="onSaveWorkspace">保存</n-button>
      <n-button :disabled="loading" @click="onOpenWorkspace">打开</n-button>
      <n-button @click="onToogleLog">日志</n-button>
      <n-button @click="onToggleSerialport">串口</n-button>
      <n-button @click="onToggleCode">代码</n-button>
      <n-button @click="onLinkTest">测试</n-button>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <div class="flex-1">
        <BlocklyView ref="blocklyRef" class="size-full" />
      </div>
      <ResizableView class="w-100" :class="codeState?.visible ? '' : 'hidden'" edge="left" :min-size="400" :max-size="600">
        <CodeView class="h-full" :code="codeState?.code || ''" />
      </ResizableView>
    </div>

    <BottomView />
    <div>
      <div v-if="headerTeleports">
        <Teleport v-if="headerTeleports.left" :to="headerTeleports.left">
          <!-- <div>Left</div> -->
        </Teleport>
        <Teleport v-if="headerTeleports.right" :to="headerTeleports.right">
          <!-- <div>right</div> -->
        </Teleport>
      </div>
    </div>
  </div>
</template>
