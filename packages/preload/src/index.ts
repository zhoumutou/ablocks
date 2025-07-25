import type { IpcRendererEvent } from 'electron'
import type { Bridge, ListenerCleanup } from '@ablocks/common/messages'
import { contextBridge, ipcRenderer } from 'electron'

const bridge = {
  postMessage(channel: string, message: any, transfer?: MessagePort[]): void {
    console.log(`[bridge] postMessage ${channel || 'all'}`)
    ipcRenderer.postMessage(channel, message, transfer)
  },
  invoke<T = any>(channel: string, ...args: any[]): Promise<T> {
    console.log(`[bridge] invoke ${channel}`)
    return ipcRenderer.invoke(channel, ...args)
  },
  send(channel: string, ...args: any[]): void {
    console.log(`[bridge] send ${channel}`)
    ipcRenderer.send(channel, ...args)
  },
  on(channel: string, listener: (...args: any[]) => void): ListenerCleanup {
    console.log(`[bridge] on ${channel}`)
    const callback = (_event: IpcRendererEvent, ...args: any[]) => listener(...args)
    ipcRenderer.on(channel, callback)
    return () => {
      console.log(`[bridge] off ${channel}`)
      ipcRenderer.removeListener(channel, callback)
    }
  },
  once(channel: string, listener: (...args: any[]) => void): void {
    console.log(`[bridge] once ${channel}`)
    const callback = (_event: IpcRendererEvent, ...args: any[]) => listener(...args)
    ipcRenderer.once(channel, callback)
  },
  removeAll(channel?: string): void {
    console.log(`[bridge] removeAll ${channel || 'all'}`)
    ipcRenderer.removeAllListeners(channel)
  },
} satisfies Bridge

function onUnload() {
  console.log('[bridge] cleaning up listeners')
  bridge.removeAll()

  window.removeEventListener('unload', onUnload)
}
window.addEventListener('unload', onUnload)

contextBridge.exposeInMainWorld('bridge', bridge)
console.log('[bridge] ready')
