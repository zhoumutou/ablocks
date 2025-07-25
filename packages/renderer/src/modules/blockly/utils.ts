import type { Abstract, ToolboxItemInfo } from '@/types'
import theme from './theme'
import toolbox from './toolbox'

export function getThemeName() {
  return theme.name
}

export function getDefaultToolbox() {
  return toolbox
}

/**
 * 比较两个工具箱项是否相等
 * @param item1 第一个工具箱项
 * @param item2 第二个工具箱项
 * @returns 两个项是否相等
 */
export function areToolboxItemsEqual(item1: ToolboxItemInfo, item2: ToolboxItemInfo): boolean {
  // 1. 首先比较 kind - 必须是同一种类型
  if (item1.kind !== item2.kind) {
    return false
  }

  // 2. 根据不同类型进行比较
  switch (item1.kind) {
    case 'block':
      // 块主要通过 type 唯一标识
      return (item1 as any).type === (item2 as any).type

    case 'category':
      // 分类可以通过 name 或 custom 属性标识
      if ((item1 as any).custom && (item2 as any).custom) {
        // 如果有 custom 属性（如 VARIABLE, PROCEDURE），优先比较
        return (item1 as any).custom === (item2 as any).custom
      }
      // 没有 custom 时比较 name
      return (item1 as any).name === (item2 as any).name

    case 'button':
      // 按钮可通过 text 和 callbackKey 标识
      return (
        (item1 as any).text === (item2 as any).text
        && (item1 as any).callbackKey === (item2 as any).callbackKey
      )

    case 'label':
      // 标签通过 text 比较
      return (item1 as any).text === (item2 as any).text

    case 'sep':
    case 'separator':
      // 分隔符通常没有唯一标识
      // 如果需要精确识别分隔符，可以考虑给它们添加自定义ID
      // 这里使用引用比较，或者如果有 gap 属性也可以比较
      if ((item1 as any).gap !== undefined && (item2 as any).gap !== undefined) {
        return (item1 as any).gap === (item2 as any).gap
      }
      return item1 === item2 // 引用比较

    default:
      // 对于其他未知类型，使用引用比较
      return item1 === item2
  }
}

const EVENT_TYPES = [
  'viewport_change',
  'bubble_open',
  'click',
  'marker_move',
  'selected',
  'toolbox_item_select',
  'theme_change',
]
// 检查是否应该重新生成代码
export function shouldRegenerateCode(event: Abstract): boolean {
  return !EVENT_TYPES.includes(event.type)
}
