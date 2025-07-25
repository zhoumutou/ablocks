import { WindowEvent, WindowInvoke } from '@ablocks/common/messages'
import { ipc } from '@/utils'
import { createWindow, isWindowAlive, onWindowMinimize, onWindowMaximize, onWindowClose, onWindowFullScreen, onWindowBringToFront } from '@/window'

export default function listen() {
  console.log('[message] listen window messages')

  ipc.handle(WindowInvoke.create, (_event, route, options) => {
    const win = createWindow(route, options)
    return win.id
  })

  ipc.handle(WindowInvoke.isAlive, (_event, windowId) => isWindowAlive(windowId))

  ipc.on(WindowEvent.minimize, onWindowMinimize)
  ipc.on(WindowEvent.maximize, onWindowMaximize)
  ipc.on(WindowEvent.close, onWindowClose)
  ipc.on(WindowEvent.fullScreen, onWindowFullScreen)
  ipc.on(WindowEvent.bringToFront, onWindowBringToFront)
}
