<script setup lang="ts">
import { noticeService } from '@/services'
import { useMessage } from 'naive-ui'

onMounted(() => {
  const message = useMessage()

  const subscription = noticeService.subscribe(({ content, options }) => {
    message.create(content, options)
  })

  onBeforeUnmount(() => {
    subscription.unsubscribe()
  })
})
</script>

<template>
  <div class="contents">
    <slot />
  </div>
</template>
