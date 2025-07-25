import { UpdateEvent } from '@ablocks/common/messages'
import { ipc } from '@/utils'
import { checkForUpdates, downloadUpdate, quitAndInstall } from '@/updater'

export default function listen() {
  console.log('[message] listen updater messages')

  ipc.on(UpdateEvent.checkForUpdates, checkForUpdates)
  ipc.on(UpdateEvent.downloadUpdate, downloadUpdate)
  ipc.on(UpdateEvent.quitAndInstall, quitAndInstall)
}
