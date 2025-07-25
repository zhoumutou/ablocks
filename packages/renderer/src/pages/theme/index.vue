<template>
  <div class="relative">Theme</div>
  <n-space>
    <n-button>Default</n-button>
    <n-button type="tertiary">
      Tertiary
    </n-button>
    <n-button type="primary">
      Primary
    </n-button>
    <n-button type="info">
      Info
    </n-button>
    <n-button type="success">
      Success
    </n-button>
    <n-button type="warning">
      Warning
    </n-button>
    <n-button type="error">
      Error
    </n-button>
  </n-space>
  <n-space>
    <n-button strong secondary>
      Default
    </n-button>
    <n-button strong secondary type="tertiary">
      Tertiary
    </n-button>
    <n-button strong secondary type="primary">
      Primary
    </n-button>
    <n-button strong secondary type="info">
      Info
    </n-button>
    <n-button strong secondary type="success">
      Success
    </n-button>
    <n-button strong secondary type="warning">
      Warning
    </n-button>
    <n-button strong secondary type="error">
      Error
    </n-button>
    <n-button strong secondary round>
      Default
    </n-button>
    <n-button strong secondary round type="primary">
      Primary
    </n-button>
    <n-button strong secondary round type="info">
      Info
    </n-button>
    <n-button strong secondary round type="success">
      Success
    </n-button>
    <n-button strong secondary round type="warning">
      Warning
    </n-button>
    <n-button strong secondary round type="error">
      Error
    </n-button>
  </n-space>
  <n-space>
    <n-button ghost>
      Default
    </n-button>
    <n-button type="primary" ghost>
      Primary
    </n-button>
    <n-button type="info" ghost>
      Info
    </n-button>
    <n-button type="success" ghost>
      Success
    </n-button>
    <n-button type="warning" ghost>
      Warning
    </n-button>
    <n-button type="error" ghost>
      Error
    </n-button>
  </n-space>
  <div>
    <span class="text-primary-500">Primary</span>
    <span class="text-primary-400">Primary</span>
    <span class="text-info-500">Info</span>
    <span class="text-info-400">Info</span>
    <span class="text-success-500">Success</span>
    <span class="text-success-400">Success</span>
    <span class="text-warning-500">Warning</span>
    <span class="text-warning-400">Warning</span>
    <span class="text-error-500">Error</span>
    <span class="text-error-400">Error</span>
  </div>
  <NThemeEditor />
</template>

<script setup lang="ts">
import { NThemeEditor } from 'naive-ui'
</script>
