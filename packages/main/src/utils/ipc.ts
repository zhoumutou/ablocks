import type { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import type { IpcMainWrapper, MsgEventMap, MsgForwardMap, MsgInvokeMap, MainEventListener, MainInvokeHandler } from '@ablocks/common/messages'
import { ipcMain } from 'electron'
import { AppEvent } from '@ablocks/common/messages'

export const ipc = {
  handle<K extends keyof MsgInvokeMap>(channel: K, listener: MainInvokeHandler<K, IpcMainInvokeEvent>): void {
    ipcMain.handle(channel, listener)
  },

  handleOnce<K extends keyof MsgInvokeMap>(channel: K, listener: MainInvokeHandler<K, IpcMainInvokeEvent>): void {
    ipcMain.handleOnce(channel, listener)
  },

  emit<K extends keyof MsgEventMap>(channel: K, ...args: Parameters<MsgEventMap[K]>): boolean {
    return ipcMain.emit(channel, ...args)
  },

  send<K extends keyof MsgForwardMap>(channel: K, windowId = 0, ...args: Parameters<MsgForwardMap[K]>): boolean {
    return ipcMain.emit(AppEvent.forwardMessage, null, windowId, channel, ...args)
  },

  on<K extends keyof MsgEventMap>(channel: K, listener: MainEventListener<K, IpcMainEvent>): void {
    ipcMain.on(channel, listener)
  },

  once<K extends keyof MsgEventMap>(channel: K, listener: MainEventListener<K, IpcMainEvent>): void {
    ipcMain.once(channel, listener)
  },

  off<K extends keyof MsgEventMap>(channel: K, listener: MainEventListener<K, IpcMainEvent>): void {
    ipcMain.off(channel, listener)
  },

  removeAllListeners(channel?: string): void {
    ipcMain.removeAllListeners(channel)
  },
} satisfies IpcMainWrapper<IpcMainEvent, IpcMainInvokeEvent>
