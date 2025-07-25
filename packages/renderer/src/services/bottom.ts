import type { BottomTab } from './views'
import { BehaviorSubject } from 'rxjs'
import eventService, { kAppEvent } from './event'
import { BottomTabs } from './views'

export interface BottomState {
  visible: boolean
  activeTab?: BottomTab
}

const defaultTab = BottomTabs.log

const state$ = new BehaviorSubject<BottomState>({
  visible: true,
  activeTab: defaultTab,
})

eventService.subscribe(kAppEvent.BOTTOM_STATE_CHANGING, ({ visible, activeTab }) => {
  const current = state$.getValue()

  const newVisible = visible ?? activeTab !== undefined
  state$.next({ ...current, visible: newVisible, activeTab })

  eventService.publish(kAppEvent.BOTTOM_STATE_CHANGED, {
    visible: newVisible,
    activeTab,
  })
})

function next(state: BottomState) {
  state$.next(state)

  eventService.publish(kAppEvent.BOTTOM_STATE_CHANGED, state)
}

const bottomService = {
  close() {
    const { activeTab } = state$.getValue()
    next({ activeTab, visible: false })
  },
  toggle() {
    const { activeTab, visible } = state$.getValue()
    const newVisible = !visible
    const tab = activeTab ?? defaultTab

    next({ activeTab: tab, visible: newVisible })
  },
  switch(tab: BottomTab) {
    const current = state$.getValue()
    if (current.activeTab === tab) {
      return
    }

    next({ activeTab: tab, visible: true })
  },

  // 提供状态订阅
  getState() {
    return state$.getValue()
  },

  // 订阅状态变化
  subscribeToState(observer: (state: BottomState) => void) {
    return state$.subscribe(observer)
  },
}

export default bottomService
