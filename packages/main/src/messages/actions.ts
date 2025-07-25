import { UpdateEvent, AppForward } from '@ablocks/common/messages'
import { ipc } from '@/utils'

export function checkForUpdates() {
  ipc.emit(UpdateEvent.checkForUpdates)
}

export function openAbout() {
  ipc.send(AppForward.openAbout)
}

export function openSetting() {
  ipc.send(AppForward.openSetting)
}
