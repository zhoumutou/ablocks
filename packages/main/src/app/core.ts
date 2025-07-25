import type { Event as ElectronEvent, WebContents } from 'electron'
import process from 'node:process'
import { app, BrowserWindow } from 'electron'
import { AppEvent } from '@ablocks/common/messages'
import { ipc, isMac } from '@/utils'
import { bringToFront, createWindow } from '@/window'
import { MAIN_WINDOW_SIZE } from '@/config'
import { listenMessages } from '@/messages'
import { initMenu } from '@/menu'
import { getDate } from '@ablocks/common'
// import { initUpdater } from '@/updater'

let mainWindow: BrowserWindow | undefined

function singleton() {
  const lock = app.requestSingleInstanceLock()
  if (!lock) {
    process.stdout.write(`Other instance detected: exiting...\n`)
    app.exit()
    return
  }

  app.on('second-instance', () => {
    mainWindow ? bringToFront(mainWindow) : app.exit()
  })

  console.log('[app] singleton')
}

function listenEvents() {
  console.log('[app] listenEvents')

  app.on('activate', onActivate)
  app.on('web-contents-created', onWebContentCreated)
  app.on('will-quit', onWillQuit)
  app.on('window-all-closed', onWindowAllClosed)
}

function onActivate() {
  console.log('[app] onActivate')

  if (BrowserWindow.getAllWindows().length === 0) {
    onReady()
  }
}

function onReady() {
  console.log('[app] onReady')
  mainWindow = createWindow('/', MAIN_WINDOW_SIZE)
}

function onWebContentCreated(_e: ElectronEvent, contents: WebContents) {
  console.log('[app] onWebContentCreated')

  contents.on('will-attach-webview', event => {
    event.preventDefault()
  })
  contents.on('will-navigate', event => {
    event.preventDefault()
  })
  contents.setWindowOpenHandler(() => {
    return { action: 'deny' }
  })
}

function onWillQuit() {
  console.log('[app] onWillQuit')

  ipc.removeAllListeners()
  app.removeAllListeners()
}

function onWindowAllClosed() {
  console.log('[app] onWindowAllClosed')
  !isMac && app.quit()
}

function forwardMessage() {
  console.log('[app] forwardMessage')

  ipc.on(AppEvent.forwardMessage, (_event, windowId, channel, ...args) => {
    const win = windowId ? BrowserWindow.fromId(windowId) : mainWindow
    if (!win) {
      return
    }

    console.log(`[app] forward message: ${channel}, args: ${JSON.stringify(args)}`)
    win.webContents.send(channel, ...args)
  })
}

export function create() {
  console.log(`[app] create ${getDate(undefined, 'YYYY-MM-DD HH:mm:ss')}`)

  singleton()
  listenEvents()
  forwardMessage()

  initMenu()
  listenMessages()

  // app.enableSandbox()
  app.whenReady().then(() => {
    onReady()
    // initUpdater()
  })
}
