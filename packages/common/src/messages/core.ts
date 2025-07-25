import type { AppEvent, AppForwardMap, AppInvokeMap } from './app'
import type { DialogInvokeMap } from './dialog'
import type { FileInvokeMap } from './file'
import type { SerialPortInvokeMap } from './serialport'
import type { UpdateEventMap, UpdateForwardMap } from './update'
import type { WindowEventMap, WindowInvokeMap } from './window'

interface MsgForwardMap extends
  AppForwardMap,
  UpdateForwardMap {
}

interface MsgEventMap extends
  UpdateEventMap,
  WindowEventMap {
  [AppEvent.forwardMessage]: <K extends keyof MsgForwardMap>(windowId: number, channel: K, ...args: Parameters<MsgForwardMap[K]>) => void
}

interface MsgInvokeMap extends
  AppInvokeMap,
  DialogInvokeMap,
  FileInvokeMap,
  SerialPortInvokeMap,
  WindowInvokeMap {
}

type MainEventListener<K extends keyof MsgEventMap, TEvent>
  = (event: TEvent, ...args: Parameters<MsgEventMap[K]>) => void

type MainInvokeHandler<K extends keyof MsgInvokeMap, TEvent>
  = (event: TEvent, ...args: Parameters<MsgInvokeMap[K]>) => ReturnType<MsgInvokeMap[K]>

interface IpcMainWrapper<TMainEvent = any, TMainInvokeEvent = any> {
  /**
   * 处理渲染进程的调用请求
   * @param channel 消息通道
   * @param handler 处理函数
   */
  handle: <K extends keyof MsgInvokeMap>(
    channel: K,
    listener: MainInvokeHandler<K, TMainInvokeEvent>
  ) => void

  /**
   * 一次性处理渲染进程的调用请求
   * @param channel 消息通道
   * @param handler 处理函数
   */
  handleOnce: <K extends keyof MsgInvokeMap>(
    channel: K,
    listener: MainInvokeHandler<K, TMainInvokeEvent>
  ) => void

  /**
   * 向所有渲染进程发送事件
   * @param channel 消息通道
   * @param args 事件参数
   * @returns 是否发送成功
   */
  emit: <K extends keyof MsgEventMap>(
    channel: K,
    ...args: Parameters<MsgEventMap[K]>
  ) => boolean

  /**
   * 向特定窗口发送消息
   * @param channel 消息通道
   * @param windowId 窗口ID
   * @param args 事件参数
   * @returns 是否发送成功
   */
  send: <K extends keyof MsgForwardMap>(
    channel: K,
    windowId: number,
    ...args: Parameters<MsgForwardMap[K]>
  ) => boolean

  /**
   * 监听渲染进程发送的事件
   * @param channel 消息通道
   * @param listener 监听函数
   */
  on: <K extends keyof MsgEventMap>(
    channel: K,
    listener: MainEventListener<K, TMainEvent>
  ) => void

  /**
   * 一次性监听渲染进程发送的事件
   * @param channel 消息通道
   * @param listener 监听函数
   */
  once: <K extends keyof MsgEventMap>(
    channel: K,
    listener: MainEventListener<K, TMainEvent>
  ) => void

  /**
   * 移除特定事件监听器
   * @param channel 消息通道
   * @param listener 要移除的监听函数
   */
  off: <K extends keyof MsgEventMap>(
    channel: K,
    listener: MainEventListener<K, TMainEvent>
  ) => void

  /**
   * 移除所有监听器
   * @param channel 可选的特定通道
   */
  removeAllListeners: (channel?: string) => void
}

/**
 * 渲染进程IPC监听器类型
 */
type RendererEventListener<K extends keyof MsgForwardMap> = (
  ...args: Parameters<MsgForwardMap[K]>
) => void

type ListenerCleanup = () => void

/**
 * IPC渲染进程通信抽象封装
 */
interface IpcRendererWrapper {
  /**
   * 调用主进程方法并等待返回结果
   * @param channel 消息通道
   * @param args 调用参数
   */
  invoke: <K extends keyof MsgInvokeMap>(
    channel: K,
    ...args: Parameters<MsgInvokeMap[K]>
  ) => Promise<ReturnType<MsgInvokeMap[K]> | undefined>

  /**
   * 向主进程发送事件
   * @param channel 消息通道
   * @param args 事件参数
   */
  send: <K extends keyof MsgEventMap>(
    channel: K,
    ...args: Parameters<MsgEventMap[K]>
  ) => void

  /**
   * 监听主进程发送的事件
   * @param channel 消息通道
   * @param listener 监听函数
   */
  on: <K extends keyof MsgForwardMap>(
    channel: K,
    listener: RendererEventListener<K>
  ) => ListenerCleanup | undefined

  /**
   * 一次性监听主进程发送的事件
   * @param channel 消息通道
   * @param listener 监听函数
   */
  once: <K extends keyof MsgForwardMap>(
    channel: K,
    listener: RendererEventListener<K>
  ) => void

  /**
   * 移除所有监听器
   * @param channel 可选的特定通道
   */
  removeAll: (channel?: string) => void
}

interface Bridge {
  postMessage: (channel: string, message: any, transfer?: MessagePort[]) => void
  invoke: <T = any>(channel: string, ...args: any[]) => Promise<T>
  send: (channel: string, ...args: any[]) => void
  on: (channel: string, listener: (...args: any[]) => void) => ListenerCleanup
  once: (channel: string, listener: (...args: any[]) => void) => void
  removeAll: (channel?: string) => void
}

export type {
  IpcMainWrapper,
  IpcRendererWrapper,
  MsgEventMap,
  MsgInvokeMap,
  MsgForwardMap,
  MainEventListener,
  MainInvokeHandler,
  RendererEventListener,
  ListenerCleanup,
  Bridge,
}
