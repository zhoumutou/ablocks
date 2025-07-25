import type { BottomTab } from './views'
import { Subject } from 'rxjs'

export enum kAppEvent {
  BOTTOM_STATE_CHANGING = 'bottom-state-changing',
  BOTTOM_STATE_CHANGED = 'bottom-state-changed',
}

// 事件载荷类型映射
interface AppEventPayloads {
  [kAppEvent.BOTTOM_STATE_CHANGING]: { visible?: boolean, activeTab?: BottomTab }
  [kAppEvent.BOTTOM_STATE_CHANGED]: { visible: boolean, activeTab?: BottomTab }
}

// 应用事件接口
interface AppEvent<T extends kAppEvent = kAppEvent> {
  type: T
  payload: AppEventPayloads[T]
}

// 创建事件总线
const event$ = new Subject<AppEvent>()

// 发布事件
function publish<T extends kAppEvent>(type: T, payload: AppEventPayloads[T]) {
  event$.next({ type, payload })
}

// 订阅特定类型的事件
function subscribe<T extends kAppEvent>(type: T, handler: (payload: AppEventPayloads[T]) => void) {
  return event$.subscribe(event => {
    if (event.type === type) {
      handler(event.payload as AppEventPayloads[T])
    }
  })
}

// 订阅所有事件
function subscribeAll(handler: (event: AppEvent) => void) {
  return event$.subscribe(handler)
}

function unsubscribeAll() {
  return event$.unsubscribe()
}

const eventService = {
  publish,
  subscribe,
  subscribeAll,
  unsubscribeAll,
}

export default eventService
