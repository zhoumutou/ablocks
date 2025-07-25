<script setup lang="ts">
import type { DebouncedFunc } from 'lodash-es'
import type { Abstract } from '@/types'
import type { BlocklyState } from '@/services/blockly'
import type { BlocklyOptions, WorkspaceSvg } from '@/modules/blockly/core'
import { getThemeName, shouldRegenerateCode } from '@/modules/blockly/utils'
import blocklyService from '@/services/blockly'
import { codeService } from '@/services'
import { debounce } from 'lodash-es'

const DEFAULT_OPTIONS: BlocklyOptions = {
  grid: {
    spacing: 20,
    length: 2,
    colour: '#ccc',
    snap: true,
  },
  move: {
    drag: true,
    wheel: true,
  },
  zoom: {
    controls: false,
    wheel: true,
    startScale: 1,
    maxScale: 1,
    minScale: 0.1,
    scaleSpeed: 1.1,
    pinch: false,
  },
  // readOnly: true,z
  // media: 'blockly/media/',
  // renderer: 'thrasos',
  renderer: 'zelos',
  trashcan: true,
  theme: getThemeName(),
}

const el = ref<HTMLElement>()
const workspace = shallowRef<WorkspaceSvg>()
const blocklyState = ref<BlocklyState>()

function getWorkspace() {
  return workspace.value
}

async function init() {
  if (!el.value) {
    return
  }

  const subscription = blocklyService.subscribeToState(newState => {
    blocklyState.value = newState
    workspace.value?.updateToolbox(newState.toolbox)
  })

  let resizeObserver: ResizeObserver | undefined
  let debounceGenerateCode: DebouncedFunc<() => void> | undefined

  onBeforeUnmount(() => {
    subscription.unsubscribe()
    resizeObserver?.disconnect()
    workspace.value?.removeChangeListener(onWorkspaceChange)
    workspace.value?.dispose()

    debounceGenerateCode?.cancel()
  })

  const { initBlockly, inject, svgResize, workspaceToCode } = await import('@/modules/blockly/core')

  function generateCode() {
    if (!workspace.value || !blocklyState.value) {
      return
    }

    const code = workspaceToCode(workspace.value, blocklyState.value.generator)
    codeService.update(code, blocklyState.value.generator)
  }

  debounceGenerateCode = debounce(generateCode, 200, { leading: false, trailing: true })

  function onWorkspaceChange(e: Abstract) {
    if (!workspace.value || !blocklyState.value) {
      return
    }

    const shouldRegenerate = shouldRegenerateCode(e)
    if (!shouldRegenerate) {
      return
    }

    debounceGenerateCode?.()
  }

  initBlockly()

  blocklyState.value = blocklyService.getState()
  workspace.value = inject(el.value, {
    ...DEFAULT_OPTIONS,
    toolbox: blocklyState.value.toolbox,
  })

  workspace.value.addChangeListener(onWorkspaceChange)

  const resizeWorkspace = () => workspace.value && svgResize(workspace.value!)
  resizeObserver = new ResizeObserver(resizeWorkspace)
  resizeObserver.observe(el.value)
  nextTick(resizeWorkspace)
}

onMounted(init)

defineExpose({ getWorkspace })
</script>

<template>
  <div class="min-w-45 relative">
    <div ref="el" class="size-full blockly" />
  </div>
</template>
