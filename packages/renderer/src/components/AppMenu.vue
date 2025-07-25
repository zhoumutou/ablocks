<script setup lang="ts">
import type { DropdownOption, DropdownGroupOption, DropdownDividerOption, DropdownRenderOption } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { PAGE_HOME, PAGE_MARKDOWN, PAGE_THEME } from '@/config'
import MaterialIconThemeMdx from '~icons/material-icon-theme/mdx'
import MaterialIconThemeAbc from '~icons/material-icon-theme/abc'
import FluentColorHome16 from '~icons/fluent-color/home-16'

type DropdownMixedOption = DropdownOption | DropdownGroupOption | DropdownDividerOption | DropdownRenderOption

const menuOptions: DropdownMixedOption[] = [
  {
    label: () => h(RouterLink, {
      to: { name: PAGE_HOME },
    }, {
      default: () => '首页',
    }),
    key: 'home',
    icon: () => h(FluentColorHome16, {
      class: 'size-4',
    }),
  },
  {
    label: () => h(RouterLink, {
      to: { name: PAGE_MARKDOWN },
    }, {
      default: () => 'Markdown',
    }),
    key: 'markdown',
    icon: () => h(MaterialIconThemeMdx, {
      class: 'size-4',
    }),
  },
  {
    label: () => h(RouterLink, {
      to: { name: PAGE_THEME },
    }, {
      default: () => '主题',
    }),
    key: 'theme',
    icon: () => h(MaterialIconThemeAbc, {
      class: 'size-4',
    }),
  },
]
</script>

<template>
  <n-dropdown trigger="click" placement="top-start" :options="menuOptions">
    <span class="cursor-pointer">
      <i-clarity-menu-line class="size-5" />
    </span>
  </n-dropdown>
</template>
