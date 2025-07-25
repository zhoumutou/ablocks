import type { MenuItemConstructorOptions } from 'electron'

export function editMenuItem() {
  const menuItem: MenuItemConstructorOptions = {
    role: 'editMenu',
    label: '编辑',
    submenu: [
      { role: 'undo', label: '撤消' },
      { role: 'redo', label: '重做' },
      { type: 'separator' },
      { role: 'cut', label: '剪切' },
      { role: 'copy', label: '复制' },
      { role: 'paste', label: '粘贴' },
      { role: 'selectAll', label: '全选' },
    ],
  }

  return menuItem
}
