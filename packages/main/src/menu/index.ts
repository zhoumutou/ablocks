import { Menu } from 'electron'
import { isMac, getAppProductName } from '@/utils'
import { appMenuItem } from './app'
import { editMenuItem } from './edit'
import { windowMenuItem } from './window'

function buildMainMenu() {
  return [
    appMenuItem(getAppProductName()),
    editMenuItem(),
    windowMenuItem(),
  ]
}

export function initMenu() {
  console.log('[menu] init menu')

  const menu = isMac ? Menu.buildFromTemplate(buildMainMenu()) : null
  Menu.setApplicationMenu(menu)
}
