<script lang="ts" setup>
import { WindowEvent } from '@ablocks/common/messages'
import { ipc } from '@/utils'

function onWindowMinimize() {
  ipc.send(WindowEvent.minimize)
}

function onWindowMaximize() {
  ipc.send(WindowEvent.maximize)
}

function onWindowClose() {
  ipc.send(WindowEvent.close)
}
</script>

<template>
  <div class="flex gap-[2px]">
    <span class="px-[2px] cursor-pointer" @click="onWindowMinimize">
      <i-clarity-minus-line class="size-6" />
    </span>
    <span class="px-[2px] cursor-pointer" @click="onWindowMaximize">
      <i-clarity-window-max-line class="size-6" />
    </span>
    <span class="px-[2px] cursor-pointer" @click="onWindowClose">
      <i-clarity-window-close-line class="size-6" />
    </span>
  </div>
</template>
