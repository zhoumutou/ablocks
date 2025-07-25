import type { IpcRendererWrapper, MsgEventMap, MsgForwardMap, MsgInvokeMap, RendererEventListener, ListenerCleanup } from '@ablocks/common/messages'

export const ipc = {
  invoke<K extends keyof MsgInvokeMap>(channel: K, ...args: Parameters<MsgInvokeMap[K]>): Promise<ReturnType<MsgInvokeMap[K]> | undefined> {
    return window.bridge?.invoke<ReturnType<MsgInvokeMap[K]>>(channel, ...args)
  },

  send<K extends keyof MsgEventMap>(channel: K, ...args: Parameters<MsgEventMap[K]>): void {
    window.bridge?.send(channel, ...args)
  },

  on<K extends keyof MsgForwardMap>(channel: K, listener: RendererEventListener<K>): ListenerCleanup | undefined {
    return window.bridge?.on(channel, listener)
  },

  once<K extends keyof MsgForwardMap>(channel: K, listener: RendererEventListener<K>): void {
    window.bridge?.once(channel, listener)
  },

  removeAll(channel?: string): void {
    window.bridge?.removeAll(channel)
  },
} satisfies IpcRendererWrapper
