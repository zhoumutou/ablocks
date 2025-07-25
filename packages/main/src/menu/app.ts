import type { MenuItemConstructorOptions } from 'electron'
import { openAbout, openSetting, checkForUpdates } from '@/messages'

export function appMenuItem(productName: string) {
  const menuItem: MenuItemConstructorOptions = {
    role: 'appMenu',
    label: productName,
    submenu: [
      {
        label: `关于${productName}`,
        click() {
          openAbout()
        },
      },
      {
        type: 'separator',
      },
      {
        label: '检查更新',
        click() {
          checkForUpdates()
        },
      },
      {
        label: '设置',
        accelerator: 'Command+,',
        click() {
          openSetting()
        },
      },
      {
        type: 'separator',
      },
      {
        role: 'services',
        label: '服务',
      },
      {
        type: 'separator',
      },
      {
        role: 'hide',
        label: `隐藏${productName}`,
      },
      {
        role: 'hideOthers',
        label: '隐藏其它',
      },
      {
        role: 'unhide',
        label: '显示所有',
      },
      {
        type: 'separator',
      },
      {
        role: 'quit',
        label: `退出${productName}`,
      },
    ],
  }

  return menuItem
}
