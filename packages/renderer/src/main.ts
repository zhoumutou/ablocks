import './assets/styles/tailwind.css'
import './assets/styles/index.scss'

import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'
import { errorHandle } from '@/utils'
// import { initBlockly } from '@/modules/blockly'

// initBlockly()

createApp(App).use(router).use(errorHandle).mount('#app')
