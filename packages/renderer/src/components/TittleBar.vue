<script setup lang="ts">
import { useTitle } from '@/hooks/useTitle'

interface Props {
  observe?: boolean
  title?: string
}
const props = withDefaults(defineProps<Props>(), {
  observe: true,
})

let docTitle: Ref<string> | undefined

function init() {
  if (props.observe) {
    docTitle = useTitle()
  }
}

init()
</script>

<template>
  <div class="h-[30px] allow-drag flex items-center relative">
    <div class="absolute left-0 pl-2 no-drag">
      <slot name="left" />
    </div>

    <div v-if="observe || title" class="absolute left-1/2 transform -translate-x-1/2 select-none text-sm">
      <n-text v-if="observe">{{ docTitle }}</n-text>
      <slot v-else>
        <n-text>{{ title }}</n-text>
      </slot>
    </div>

    <div class="absolute right-0 pr-2 no-drag">
      <slot name="right" />
    </div>
  </div>
</template>
