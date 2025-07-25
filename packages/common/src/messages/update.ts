import type { ProgressInfo, UpdateInfo } from './types'

export enum UpdateEvent {
  checkForUpdates = 'update:checkForUpdates',
  downloadUpdate = 'update:downloadUpdate',
  quitAndInstall = 'update:quitAndInstall',
}

export enum UpdateForward {
  downloadProgress = 'app:downloadProgress',
  updateDownloaded = 'app:updateDownloaded',
}

export interface UpdateEventMap {
  [UpdateEvent.checkForUpdates]: () => void
  [UpdateEvent.downloadUpdate]: () => void
  [UpdateEvent.quitAndInstall]: () => void
}

export interface UpdateForwardMap {
  [UpdateForward.downloadProgress]: (progressInfo: ProgressInfo) => void
  [UpdateForward.updateDownloaded]: (updateInfo: UpdateInfo) => void
}
