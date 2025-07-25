<script setup lang="ts">
import type { Language, Theme, Options } from '@/modules/code'
import { throttle } from 'lodash-es'

interface Props {
  code: string
  language?: Language
  theme?: Theme
  showLineNumber?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  language: 'javascript',
  theme: 'one-light',
  showLineNumber: true,
})

const html = ref('')

async function init() {
  let codeToHtml: ((code: string, options?: Options) => string) | undefined

  function generate() {
    if (!codeToHtml) {
      return
    }

    html.value = codeToHtml(props.code, {
      lang: props.language,
      theme: props.theme,
      addLineNumbers: props.showLineNumber,
    })
  }

  const throttleGenerate = throttle(generate, 100, { leading: false, trailing: true })

  watch(() => props.code, throttleGenerate, { immediate: true })

  onBeforeUnmount(() => {
    throttleGenerate.cancel()
  })

  codeToHtml = await import('@/modules/code').then(mod => mod.codeToHtml)
}

onMounted(init)
</script>

<template>
  <div class="flex relative overflow-hidden">
    <div class="shiki-code w-full overflow-hidden" v-html="html" />
  </div>
</template>
