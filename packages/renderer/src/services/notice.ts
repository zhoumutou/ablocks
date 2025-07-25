import type { MessageOptions } from 'naive-ui'
import { Subject } from 'rxjs'

export interface NoticeOption {
  content: string
  options?: MessageOptions
}

const subject$ = new Subject<NoticeOption>()

function create(content: string, options?: MessageOptions) {
  subject$.next({ content, options })
}

const noticeService = {
  info(content: string, options?: MessageOptions) {
    create(content, { ...options, type: 'info' })
  },
  success(content: string, options?: MessageOptions) {
    create(content, { ...options, type: 'success' })
  },
  warn(content: string, options?: MessageOptions) {
    create(content, { ...options, type: 'warning' })
  },
  error(content: string, options?: MessageOptions) {
    create(content, { ...options, type: 'error' })
  },
  loading(content: string, options?: MessageOptions) {
    create(content, { ...options, type: 'loading' })
  },

  // 订阅状态变化
  subscribe(observer: (option: NoticeOption) => void) {
    return subject$.subscribe(observer)
  },
}

export default noticeService
