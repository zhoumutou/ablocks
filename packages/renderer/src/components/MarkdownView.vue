<script setup lang="ts">
import { useStreamMarkdown } from '@/modules/markdown'
import 'github-markdown-css'

const props = defineProps<Props>()

enum RenderType {
  RAW = 'raw',
  STREAM = 'stream',
}

interface RawRenderData {
  type: 'raw'
  code: string
}

interface StreamRenderData {
  type: 'stream'
  chunks: string[]
  finished: boolean
}

export type RenderData = RawRenderData | StreamRenderData

interface Props {
  data: RenderData
}

const el = ref<HTMLElement>()

onMounted(async () => {
  const { writeChunk, endWrite } = await useStreamMarkdown(el.value!)

  if (props.data.type === RenderType.RAW) {
    el.value!.innerHTML = ''
    writeChunk(props.data.code)
    endWrite()
    return
  }

  const onCleanup = watch(
    () => props.data as StreamRenderData,
    (data, oldData) => {
      if (!data || data.type !== RenderType.STREAM || data.finished) {
        endWrite()
        return
      }

      const oldChunks = oldData?.chunks
      if (oldChunks && data.chunks.length <= oldChunks.length) {
        el.value!.innerHTML = ''
        data.chunks.forEach(chunk => writeChunk(chunk))
        return
      }

      data.chunks.slice(oldChunks?.length || 0).forEach(chunk => writeChunk(chunk))
    },
    { immediate: true },
  )

  onBeforeUnmount(onCleanup)
})
</script>

<template>
  <div ref="el" class="markdown-body shiki-code overflow-hidden" />
</template>
