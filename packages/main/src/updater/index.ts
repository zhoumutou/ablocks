import { autoUpdater, DOWNLOAD_PROGRESS, UPDATE_DOWNLOADED } from 'electron-updater'
import { UpdateForward } from '@ablocks/common/messages'
import { ipc } from '@/utils'

export function initUpdater() {
  console.log('[updater] init')

  autoUpdater.forceDevUpdateConfig = import.meta.env.MODE === 'dev'
  // autoUpdater.autoDownload = false

  autoUpdater.on(DOWNLOAD_PROGRESS, progressInfo => {
    console.log(`[updater] download progress ${progressInfo.percent}/${progressInfo.total}`)
    ipc.send(UpdateForward.downloadProgress, 0, progressInfo)
  })

  autoUpdater.on(UPDATE_DOWNLOADED, e => {
    const { version, releaseDate, releaseName, releaseNotes, files } = e
    const updateInfo = { version, releaseDate, releaseName, releaseNotes, files }
    console.log(`[updater] update downloaded, ${JSON.stringify(e)}`)
    ipc.send(UpdateForward.updateDownloaded, 0, updateInfo)
  })
}

export async function checkForUpdates() {
  console.log(`[updater] checkForUpdates, current: ${autoUpdater.currentVersion}`)
  const result = await autoUpdater.checkForUpdates().catch(reason => {
    console.error(`[updater] check fail, ${reason}`)
  })
  if (!result) {
    console.log(`[updater] update is disabled`)
    return
  }

  const { updateInfo } = result
  const hasNew = autoUpdater.currentVersion.compare(updateInfo.version) < 0
  if (!hasNew) {
    console.log(`[updater] already latest version`)
    return
  }

  console.log(`[updater] new version: ${updateInfo.version}`)
  return updateInfo
}

export async function downloadUpdate() {
  console.log(`[updater] downloadUpdate`)
  return autoUpdater.downloadUpdate()
}

export function quitAndInstall() {
  console.log(`[updater] quitAndInstall`)
  setImmediate(() => {
    autoUpdater.quitAndInstall()
  })
}
