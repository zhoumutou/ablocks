<template>
  <div>
    <div>
      <n-text depth="1">Page not found!</n-text>
    </div>
    <div>
      <router-link class="no-underline" :to="{ name: PAGE_HOME }">Home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PAGE_HOME } from '@/config'
</script>
