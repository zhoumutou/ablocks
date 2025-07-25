import { BehaviorSubject } from 'rxjs'

export interface CodeState {
  visible: boolean
  code: string
  language: string
}

// 初始状态
const initialState: CodeState = {
  visible: true,
  code: '',
  language: 'javascript',
}

// 状态管理
const state$ = new BehaviorSubject<CodeState>(initialState)

const codeService = {
  // 视图控制
  open() {
    const current = state$.getValue()
    if (current.visible) {
      return
    }

    state$.next({ ...current, visible: true })
  },

  close() {
    const current = state$.getValue()
    if (!current.visible) {
      return
    }

    state$.next({ ...current, visible: false })
  },

  toggle() {
    const current = state$.getValue()
    const newVisible = !current.visible

    state$.next({ ...current, visible: newVisible })
  },

  update(code: string, language?: string) {
    const current = state$.getValue()
    state$.next({ ...current, code, language: language || current.language })
  },

  // 状态订阅
  getState() {
    return state$.getValue()
  },

  subscribeToState(observer: (state: CodeState) => void) {
    return state$.subscribe(observer)
  },
}

export default codeService
