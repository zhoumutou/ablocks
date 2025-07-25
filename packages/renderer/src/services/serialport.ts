import { BehaviorSubject } from 'rxjs'
import eventService, { kAppEvent } from './event'
import { BottomTabs } from './views'

// 串口状态接口
export interface SerialportState {
  visible: boolean
  connected: boolean
  port: string | null
  baudRate: number
  availablePorts: string[]
  isScanning: boolean
}

// 初始状态
const initialState: SerialportState = {
  visible: false,
  connected: false,
  port: null,
  baudRate: 9600,
  availablePorts: [],
  isScanning: false,
}

// 状态管理
const state$ = new BehaviorSubject<SerialportState>(initialState)
const serialData$ = new BehaviorSubject<Uint8Array | null>(null)

eventService.subscribe(kAppEvent.BOTTOM_STATE_CHANGED, ({ visible, activeTab }) => {
  const current = state$.getValue()

  if (activeTab === BottomTabs.serialport) {
    if (current.visible !== visible) {
      state$.next({ ...current, visible })
    }
  } else {
    if (current.visible) {
      state$.next({ ...current, visible: false })
    }
  }
})

// 串口服务实现
export const serialportService = {
  // 视图控制
  open() {
    const current = state$.getValue()
    if (current.visible) {
      return
    }

    state$.next({ ...current, visible: true })
    eventService.publish(kAppEvent.BOTTOM_STATE_CHANGING, { visible: true, activeTab: BottomTabs.serialport })
  },

  // close() {
  //   const current = state$.getValue()
  //   if (!current.visible) {
  //     return
  //   }

  //   state$.next({ ...current, visible: false })
  //   eventService.publish(AppEventType.BOTTOM_VIEW_STATE_CHANGED, { visible: false, activeTab: BottomTabs.serialport })
  // },

  toggle() {
    const current = state$.getValue()
    const newVisible = !current.visible

    // state$.next({ ...current, visible: newVisible })
    eventService.publish(kAppEvent.BOTTOM_STATE_CHANGING, { activeTab: newVisible ? BottomTabs.serialport : undefined })
  },

  // // 串口连接控制
  // async scanPorts() {
  //   try {
  //     const current = state$.getValue()
  //     state$.next({ ...current, isScanning: true })

  //     // 模拟异步扫描串口
  //     // 实际项目中，这里会调用系统 API 获取真实串口列表
  //     await new Promise(resolve => setTimeout(resolve, 500))

  //     const ports = ['COM1', 'COM2', '/dev/tty.usbserial-1234']
  //     state$.next({ ...state$.getValue(), availablePorts: ports, isScanning: false })
  //     return ports
  //   } catch (error) {
  //     const current = state$.getValue()
  //     state$.next({ ...current, isScanning: false })
  //     console.error('Failed to scan serial ports', error)
  //     throw error
  //   }
  // },

  // async connect(port: string, baudRate: number = 9600) {
  //   try {
  //     // 实际项目中，这里会调用系统 API 进行真实的串口连接
  //     // 这里简化为状态更新
  //     state$.next({
  //       ...state$.getValue(),
  //       connected: true,
  //       port,
  //       baudRate,
  //     })

  //     // 自动打开串口面板
  //     this.open()
  //     return true
  //   } catch (error) {
  //     console.error(`Failed to connect to port ${port}`, error)
  //     throw error
  //   }
  // },

  // async disconnect() {
  //   try {
  //     // 实际项目中，这里会调用系统 API 关闭串口连接
  //     state$.next({
  //       ...state$.getValue(),
  //       connected: false,
  //       port: null,
  //     })
  //     return true
  //   } catch (error) {
  //     console.error('Failed to disconnect serial port', error)
  //     throw error
  //   }
  // },

  // // 数据发送
  // async send(data: string | Uint8Array) {
  //   const { connected } = state$.getValue()
  //   if (!connected) {
  //     throw new Error('Serial port not connected')
  //   }

  //   // 实际项目中，这里会调用系统 API 发送数据
  //   console.log('Sending data to serial port:', data)
  //   return true
  // },

  // 状态订阅
  getState() {
    return state$.getValue()
  },

  subscribeToState(observer: (state: SerialportState) => void) {
    return state$.subscribe(observer)
  },

  subscribeToData(observer: (data: Uint8Array | null) => void) {
    return serialData$.subscribe(observer)
  },
}

// // 模拟接收数据（实际项目中会由底层事件触发）
// // 仅用于示例
// function simulateReceiveData() {
//   if (serialportService.getState().connected) {
//     const randomData = new Uint8Array([...Array.from({ length: 10 })].map(() => Math.floor(Math.random() * 256)))
//     serialData$.next(randomData)
//   }
// }

// // 每秒接收一次模拟数据
// setInterval(simulateReceiveData, 1000)

export default serialportService
