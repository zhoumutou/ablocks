export enum WindowEvent {
  minimize = 'window:minimize',
  maximize = 'window:maximize',
  close = 'window:close',
  fullScreen = 'window:fullScreen',
  bringToFront = 'window:bringToFront',
}

export enum WindowInvoke {
  create = 'window:create',
  isAlive = 'window:isAlive',
}

export interface WindowEventMap {
  [WindowEvent.minimize]: () => void
  [WindowEvent.maximize]: () => void
  [WindowEvent.close]: () => void
  [WindowEvent.fullScreen]: () => void
  [WindowEvent.bringToFront]: (windowId?: number) => void
}

export interface WindowInvokeMap {
  [WindowInvoke.create]: (route: string, options?: Record<string, unknown>) => number
  [WindowInvoke.isAlive]: (windowId: number) => boolean
}
