import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { PAGE_HOME, PAGE_THEME, PAGE_NOT_FOUND, PAGE_MARKDOWN } from '@/config'

import DefaultLayout from '@/layouts/index.vue'
import PageHome from '@/pages/home/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: PAGE_HOME,
        component: PageHome,
      },
      {
        path: 'markdown',
        name: PAGE_MARKDOWN,
        component: () => import(/* webpackChunkName: "markdown" */ '@/pages/markdown/index.vue'),
        meta: {
          title: 'Markdown',
        },
      },
      {
        path: 'theme',
        name: PAGE_THEME,
        component: () => import(/* webpackChunkName: "theme" */ '@/pages/theme/index.vue'),
        meta: {
          title: '主题',
        },
      },
      {
        path: 'not-found',
        name: PAGE_NOT_FOUND,
        component: () => import(/* webpackChunkName: "404" */ '@/pages/404/index.vue'),
        meta: {
          title: 'Page Not Found',
        },
      },
    ],
  },
  {
    path: '/:_(.*)*',
    redirect: () => {
      return { name: PAGE_NOT_FOUND }
    },
  },
]

if (import.meta.env.DEV) {
  const testRoutes: RouteRecordRaw[] = [
    {
      path: 'demo',
      name: 'demo',
      component: () => import(/* webpackChunkName: "demo" */ '@/pages/demo/index.vue'),
      meta: {
        title: 'DemoRoute',
      },
    },
    {
      path: 'test',
      name: 'test',
      component: () => import(/* webpackChunkName: "test" */ '@/pages/test/index.vue'),
      meta: {
        title: 'TestRoute',
      },
    },
  ]

  routes[0]!.children?.splice(-1, 0, ...testRoutes)
}

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach(to => {
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
})

export default router
