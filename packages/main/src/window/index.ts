import type { BrowserWindowConstructorOptions, IpcMainEvent } from 'electron'
import { join } from 'node:path'
import { app, BrowserWindow } from 'electron'
import { RENDERER_DEV_URL, RENDERER_PATH, PRELOAD_PATH } from '@/config'
import global from '@/global'
import { isMac } from '@/utils'

function getPreloadPath() {
  const { appDir } = global.env
  return join(appDir, PRELOAD_PATH)
}

function onDidFinishLoad(win: BrowserWindow) {
  console.log(`[window] onDidFinishLoad`)

  bringToFront(win)
}

function onClosed(win: BrowserWindow) {
  if (win.isDestroyed()) {
    return
  }

  win.webContents.removeAllListeners()
  win.removeAllListeners()
  win.destroy()
}

function configureSecurity(win: BrowserWindow) {
  console.log(`[window] configureSecurity`)

  let csp
  if (import.meta.env.MODE === 'dev') {
    csp = [
      `script-src 'self' 'unsafe-inline'`,
      `object-src 'none'`,
    ]
  } else {
    csp = [
      `script-src 'self'`,
      `object-src 'none'`,
    ]
  }

  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': csp,
      },
    })
  })
}

function create(options?: Partial<BrowserWindowConstructorOptions>) {
  const preload = getPreloadPath()
  console.log(`[window] create`)

  return new BrowserWindow({
    titleBarStyle: 'hidden',
    ...options,
    webPreferences: {
      devTools: !app.isPackaged,
      preload,
      sandbox: true,
      enableWebSQL: false,
      webgl: false,
      spellcheck: false,
    },
  })
}

function listenEvents(win: BrowserWindow) {
  console.log(`[window] listenEvents`)

  win.once('closed', () => onClosed(win))

  const wc = win.webContents
  wc.once('did-finish-load', () => onDidFinishLoad(win))
}

function load(win: BrowserWindow, route: string) {
  if (import.meta.env.MODE === 'dev') {
    console.log(`[window] loadUrl: ${RENDERER_DEV_URL}, route: ${route}`)
    win.loadURL(`${RENDERER_DEV_URL}#${route}`)
  } else {
    console.log(`[window] loadFile: ${RENDERER_PATH}, route: ${route}`)
    win.loadFile(RENDERER_PATH, { hash: `#${route}` })
  }
}

function enableDevTools(win: BrowserWindow) {
  if (app.isPackaged) {
    return
  }

  console.log('[window] enableDevTools')
  const wc = win.webContents
  wc.addListener('before-input-event', (_event: Electron.Event, input: Electron.Input) => {
    if (input.type === 'keyUp') {
      return
    }

    const matched = (isMac ? (input.meta && input.alt) : (input.control && input.shift)) && input.code === 'KeyI'
    if (!matched) {
      return
    }

    console.log('[window] toggleDevTools')
    wc.isDevToolsOpened() ? wc.closeDevTools() : wc.openDevTools()
  })
}

export function bringToFront(win: BrowserWindow) {
  console.log(`[window] bringToFront`)

  win.isMinimized() && win.restore()
  !win.isVisible() && win.show()
  win.moveTop()
}

export function createWindow(route: string, options?: Record<string, unknown>) {
  console.log(`[window] createMainWindow`)

  const win = create({ ...options })

  listenEvents(win)
  configureSecurity(win)

  enableDevTools(win)

  // load(win, route)
  setImmediate(() => load(win, route))

  return win
}

export function isWindowAlive(windowId: number) {
  const win = BrowserWindow.fromId(windowId)
  return win ? !win.isDestroyed() : false
}

function getWindowFrom(event: IpcMainEvent) {
  return event ? BrowserWindow.fromWebContents(event.sender) : null
}

export function onWindowMinimize(event: IpcMainEvent) {
  const win = getWindowFrom(event)
  if (!win) {
    return
  }

  console.log(`[window] onWindowMinimize`)
  win.isMinimized() ? win.restore() : win.minimize()
}

export function onWindowMaximize(event: IpcMainEvent) {
  const win = getWindowFrom(event)
  if (!win) {
    return
  }

  console.log(`[window] onWindowMaximize`)
  win.isMaximized() ? win.unmaximize() : win.maximize()
}

export function onWindowClose(event: IpcMainEvent) {
  const win = getWindowFrom(event)
  if (!win) {
    return
  }

  console.log(`[window] onWindowClose`)
  win.close()
}

export function onWindowFullScreen(event: IpcMainEvent) {
  const win = getWindowFrom(event)
  if (!win) {
    return
  }

  console.log(`[window] onWindowFullScreen`)
  win.setFullScreen(!win.isFullScreen())
}

export function onWindowBringToFront(event: IpcMainEvent, windowId?: number) {
  const win = windowId ? BrowserWindow.fromId(windowId) : getWindowFrom(event)
  if (!win) {
    return
  }

  console.log(`[window] onBringToFront`)
  bringToFront(win)
}
