import type { JsonObject } from '@ablocks/common/messages'
import type { ToolboxInfo, ToolboxItemInfo } from '@/types'
import type { Workspace, BlocklyGenerator } from '@/modules/blockly/core'
import { areToolboxItemsEqual, getDefaultToolbox } from '@/modules/blockly/utils'
import { BehaviorSubject } from 'rxjs'
import { ipc } from '@/utils'
import { FileInvoke, DialogInvoke } from '@ablocks/common/messages'
import noticeService from './notice'

export interface BlocklyState {
  toolbox: ToolboxInfo
  generator: BlocklyGenerator
}

// 初始状态
const initialState: BlocklyState = {
  toolbox: getDefaultToolbox(),
  generator: 'python',
}

// 状态管理
const state$ = new BehaviorSubject<BlocklyState>(initialState)

const blocklyService = {
  addToolboxItem(item: ToolboxItemInfo) {
    const { toolbox, ...rest } = state$.getValue()
    const exists = toolbox.contents.some(it => areToolboxItemsEqual(it, item))
    if (exists) {
      console.warn('Toolbox item already exists:', item)
      return
    }

    const newToolbox: ToolboxInfo = {
      ...toolbox,
      contents: [...toolbox.contents, item],
    }
    state$.next({ ...rest, toolbox: newToolbox })
  },

  removeToolboxItem(item: ToolboxItemInfo) {
    const { toolbox, ...rest } = state$.getValue()

    const newContents = toolbox.contents.filter(it => !areToolboxItemsEqual(it, item))
    if (newContents.length === toolbox.contents.length) {
      return
    }

    const newToolbox: ToolboxInfo = {
      ...toolbox,
      contents: newContents,
    }
    state$.next({ ...rest, toolbox: newToolbox })
  },

  async saveWorkspace(workspace: Workspace) {
    const savedPath = await ipc.invoke(DialogInvoke.showSaveDialog, {
      defaultPath: 'Blockly',
      filters: [
        { name: 'Blockly Workspace', extensions: ['.json'] },
      ],
    })
    if (!savedPath) {
      noticeService.warn('未选择保存路径')
      return false
    }

    const { workspaceToData } = await import('@/modules/blockly/core')
    const data = workspaceToData(workspace)
    const success = await ipc.invoke(FileInvoke.writeJson, savedPath, data)

    success ? noticeService.success('保存成功') : noticeService.warn('保存失败')

    return success
  },

  async openWorkspace(workspace: Workspace) {
    const filePaths = await ipc.invoke(DialogInvoke.showOpenDialog, {
      properties: ['openFile'],
      filters: [
        { name: 'Blockly Workspace', extensions: ['.json'] },
      ],
    })
    if (!filePaths || filePaths.length === 0) {
      noticeService.warn('未选择文件')
      return false
    }

    const data = await ipc.invoke(FileInvoke.readJson, filePaths[0])
    if (!data) {
      noticeService.warn('打开失败')
      return false
    }

    const { workspaceLoad } = await import('@/modules/blockly/core')
    workspaceLoad(workspace, data as JsonObject)
    noticeService.success('打开成功')

    return true
  },

  // 状态订阅
  getState() {
    return state$.getValue()
  },

  subscribeToState(observer: (state: BlocklyState) => void) {
    return state$.subscribe(observer)
  },
}

export default blocklyService
