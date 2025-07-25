<script setup lang="ts">
import { ipc } from '@/utils'
import { AppInvoke } from '@ablocks/common/messages'

const log = ref('')

async function getLog() {
  const info = await ipc.invoke(AppInvoke.getAppMeta)
  if (!info) {
    return
  }

  log.value = JSON.stringify(info)
}

getLog()
</script>

<template>
  <div>
    日志 {{ log }}
  </div>
</template>
