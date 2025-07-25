import type { MenuItemConstructorOptions } from 'electron'

export function windowMenuItem() {
  const menuItem: MenuItemConstructorOptions = {
    role: 'windowMenu',
    label: '窗口',
    submenu: [
      { role: 'minimize', label: '最小化' },
      { role: 'zoom', label: '缩放' },
      { type: 'separator' },
      { role: 'togglefullscreen', label: '全屏' },
    ],
  }

  return menuItem
}
