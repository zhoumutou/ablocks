<script setup lang="ts">
import { AppForward, AppInvoke, DialogInvoke, FileInvoke, SerialPortInvoke, UpdateEvent, WindowInvoke, WindowEvent } from '@ablocks/common/messages'
import { noticeService } from '@/services'
// import { noticeService } from '@/services'
import { environment, ipc } from '@/utils'

const router = useRouter()

const result = ref('')
const subWindowId = ref(0)

onMounted(() => {
  ipc.on(AppForward.openAbout, () => {
    result.value = 'on openAbout'
  })

  ipc.on(AppForward.openSetting, () => {
    result.value = 'on openSetting'
  })
})

async function onCreateWindow() {
  const route = '/theme'

  if (environment.electron) {
    if (subWindowId.value) {
      const alive = await ipc.invoke(WindowInvoke.isAlive, subWindowId.value)
      if (alive) {
        console.log(`window ${subWindowId.value} alive`)
        ipc.send(WindowEvent.bringToFront, subWindowId.value)
        return
      }

      subWindowId.value = 0
    }

    subWindowId.value = (await ipc.invoke(WindowInvoke.create, route)) || 0
    console.log(`subWindowId: ${subWindowId.value}`)
  } else {
    router.push(route)
  }
}

function onCheckForUpdates() {
  ipc.send(UpdateEvent.checkForUpdates)
}

async function onGetAppMeta() {
  const appMeta = await ipc.invoke(AppInvoke.getAppMeta)
  result.value = `app meta: ${JSON.stringify(appMeta)}`
}

async function onGetVersion() {
  const version = await ipc.invoke(AppInvoke.getVersion)
  result.value = `version: ${version}`
}

async function onGetVersionMeta() {
  const versionMeta = await ipc.invoke(AppInvoke.getVersionMeta)
  result.value = `version meta: ${JSON.stringify(versionMeta)}`
}

async function onGetSerialPorts() {
  const serialports = await ipc.invoke(SerialPortInvoke.getSerialPorts)
  result.value = `serialports: ${JSON.stringify(serialports)}`
}

function onNotice() {
  noticeService.info('通知信息')
  noticeService.success('成功')
  noticeService.loading('加载中')
}

async function onReadWrite() {
  const savedPath = await ipc.invoke(DialogInvoke.showSaveDialog, {
    filters: [
      { name: '文本文件', extensions: ['.txt'] },
    ],
  })
  result.value = `savedPath: ${savedPath}`

  if (!savedPath) {
    noticeService.warn('未选择保存路径')
    return
  }

  const content = '123 aaa'
  const success = await ipc.invoke(FileInvoke.writeText, savedPath, content)
  if (!success) {
    noticeService.warn('文件保存失败')
    return
  }

  result.value += `, save success`
  const data = await ipc.invoke(FileInvoke.readText, savedPath)
  if (!data) {
    noticeService.warn('文件读取失败')
    return
  }

  result.value += `, content: ${content}`
  noticeService.success('文件读取成功')
}
</script>

<template>
  <div class="flex-1 flex flex-col">
    <div>
      <n-button @click="onCheckForUpdates">检查更新</n-button>
      <n-button @click="onGetAppMeta">App元数据</n-button>
      <n-button @click="onGetVersion">版本</n-button>
      <n-button @click="onGetVersionMeta">版本元数据</n-button>
      <n-button @click="onGetSerialPorts">串口</n-button>
      <n-button @click="onCreateWindow">子窗口</n-button>
    </div>
    <div>
      <n-button @click="onNotice">通知</n-button>
      <n-button @click="onReadWrite">文件读写</n-button>
    </div>
    <div>result: {{ result }}</div>
  </div>
</template>
