import type { AppMeta, AppVersionMeta } from './types'

export enum AppEvent {
  forwardMessage = 'app:forwardMessage',
}

export enum AppInvoke {
  getAppMeta = 'app:getAppMeta',
  getVersion = 'app:getVersion',
  getVersionMeta = 'app:getVersionMeta',
}

export enum AppForward {
  openAbout = 'app:openAbout',
  openSetting = 'app:openSetting',
}

export interface AppEventMap {
  [AppEvent.forwardMessage]: () => void
}

export interface AppInvokeMap {
  [AppInvoke.getAppMeta]: () => AppMeta
  [AppInvoke.getVersion]: () => string
  [AppInvoke.getVersionMeta]: () => AppVersionMeta
}
export interface AppForwardMap {
  [AppForward.openAbout]: () => void
  [AppForward.openSetting]: () => void
}
