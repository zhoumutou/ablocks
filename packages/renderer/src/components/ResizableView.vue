<script setup lang="ts">
import type { CSSProperties } from 'vue'
// import interact from '@/vendors/interact'

interface Props {
  minSize: number
  maxSize: number
  edge: 'top' | 'bottom' | 'left' | 'right'
  triggerSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  triggerSize: 3,
})

const el = ref<HTMLElement>()
const trigger = ref<HTMLElement>()

const isHorizontal = computed(() => props.edge === 'left' || props.edge === 'right')

const triggerClass = computed(() => {
  return isHorizontal.value ? 'top-0 h-full cursor-col-resize' : 'left-0 w-full cursor-row-resize'
})

const triggerStyle = computed((): CSSProperties => {
  return {
    [props.edge]: 0,
    [isHorizontal.value ? 'width' : 'height']: `${props.triggerSize}px`,
  }
})

async function init() {
  const { minSize, maxSize, edge } = props
  const interact = await import('@/vendors/interact').then(mod => mod.default)

  interact(el.value!).resizable({
    edges: { [edge]: trigger.value! },
    modifiers: [
      isHorizontal.value
        ? interact.modifiers.restrictSize({
            min: { height: 0, width: minSize },
            max: { height: Infinity, width: maxSize },
          })
        : interact.modifiers.restrictSize({
            min: { height: minSize, width: 0 },
            max: { height: maxSize, width: Infinity },
          }),
    ],
    listeners: {
      start: () => {
        document.body.classList.add('select-none')
      },
      move: e => {
        const basis = isHorizontal.value ? e.rect.width : e.rect.height
        Object.assign(e.target.style, {
          'flex-basis': `${basis}px`,
        })
      },
      end: () => {
        document.body.classList.remove('select-none')
      },
    },
  })
}

onMounted(init)
</script>

<template>
  <div ref="el" class="resizable-view relative">
    <slot />
    <div ref="trigger" class="trigger absolute transition-colors hover:bg-gray-300" :class="triggerClass" :style="triggerStyle" />
  </div>
</template>

<style lang="scss">

</style>
