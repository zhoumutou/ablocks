import { BehaviorSubject } from 'rxjs'
import eventService, { kAppEvent } from './event'
import { BottomTabs } from './views'

// 日志服务状态接口
export interface LogState {
  visible: boolean
  filter: string
  level: LogLevel
}

// 日志级别枚举
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

// 日志条目接口
export interface LogEntry {
  timestamp: number
  level: LogLevel
  message: string
  details?: any
}

// 初始状态
const initialState: LogState = {
  visible: false,
  filter: '',
  level: LogLevel.INFO,
}

// 状态管理
const state$ = new BehaviorSubject<LogState>(initialState)
const logs$ = new BehaviorSubject<LogEntry[]>([])

eventService.subscribe(kAppEvent.BOTTOM_STATE_CHANGED, ({ visible, activeTab }) => {
  const current = state$.getValue()

  if (activeTab === BottomTabs.log) {
    if (current.visible !== visible) {
      state$.next({ ...current, visible })
    }
  } else {
    if (current.visible) {
      state$.next({ ...current, visible: false })
    }
  }
})

// 日志服务实现
const logService = {
  // 视图控制
  open() {
    const current = state$.getValue()
    if (current.visible) {
      return
    }

    eventService.publish(kAppEvent.BOTTOM_STATE_CHANGING, { visible: true, activeTab: BottomTabs.log })
  },

  // close() {
  //   const current = state$.getValue()
  //   if (!current.visible) {
  //     return
  //   }

  //   state$.next({ ...current, visible: false })
  //   eventService.publish(AppEventType.LOG_VISIBILITY_CHANGED, { visible: false })
  // },

  toggle() {
    const current = state$.getValue()
    const newVisible = !current.visible

    eventService.publish(kAppEvent.BOTTOM_STATE_CHANGING, { activeTab: newVisible ? BottomTabs.log : undefined })
  },

  // 日志过滤设置
  setFilter(filter: string) {
    const current = state$.getValue()
    state$.next({ ...current, filter })
  },

  setLevel(level: LogLevel) {
    const current = state$.getValue()
    state$.next({ ...current, level })
  },

  // 日志操作
  log(level: LogLevel, message: string, details?: any) {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      details,
    }

    const currentLogs = logs$.getValue()
    logs$.next([...currentLogs, entry])

    // 如果是错误日志，自动打开日志面板
    if (level === LogLevel.ERROR) {
      this.open()
    }
  },

  debug(message: string, details?: any) {
    this.log(LogLevel.DEBUG, message, details)
  },

  info(message: string, details?: any) {
    this.log(LogLevel.INFO, message, details)
  },

  warn(message: string, details?: any) {
    this.log(LogLevel.WARN, message, details)
  },

  error(message: string, details?: any) {
    this.log(LogLevel.ERROR, message, details)
  },

  clear() {
    logs$.next([])
  },

  // 状态订阅
  getState() {
    return state$.getValue()
  },

  getLogs() {
    return logs$.getValue()
  },

  subscribeToState(observer: (state: LogState) => void) {
    return state$.subscribe(observer)
  },

  subscribeToLogs(observer: (logs: LogEntry[]) => void) {
    return logs$.subscribe(observer)
  },
}

export default logService
