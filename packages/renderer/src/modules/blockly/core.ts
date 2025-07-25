import type { Workspace, WorkspaceSvg, BlocklyOptions } from 'blockly'
import type { JsonObject } from '@ablocks/common/messages'
import { setLocale, Theme, Events, serialization, inject, svgResize } from 'blockly'
import * as zhHans from 'blockly/msg/zh-hans'

import { pythonGenerator } from 'blockly/python'
import { javascriptGenerator } from 'blockly/javascript'
import { arduinoGenerator } from './arduino'

import theme from './theme'

export type { Workspace, WorkspaceSvg, BlocklyOptions }
export { inject, svgResize }

type Locale = Record<string, string>

interface CodeGenerator {
  workspaceToCode: (workspace: Workspace) => string
}

export type BlocklyGenerator = 'python' | 'javascript' | 'arduino'

const codeGenerators: Record<BlocklyGenerator, CodeGenerator> = {
  python: pythonGenerator,
  javascript: javascriptGenerator,
  arduino: arduinoGenerator,
}

let initialized = false
export function initBlockly() {
  if (!initialized) {
    setLocale(zhHans as unknown as Locale)
    Theme.defineTheme(theme.name, theme)
    initialized = true
  }
}

export function workspaceToCode<K extends BlocklyGenerator>(workspace: Workspace, generator: K) {
  initBlockly()

  const codeGenerator = codeGenerators[generator]
  return codeGenerator.workspaceToCode(workspace)
}

export function workspaceToData(workspace: Workspace) {
  try {
    initBlockly()
    return serialization.workspaces.save(workspace)
  } catch (error) {
    console.error('Error saving workspace:', error)
    return null
  }
}

export function workspaceLoad(workspace: Workspace, state: JsonObject) {
  if (!state) {
    console.warn('Invalid state provided for loading')
    return false
  }

  try {
    initBlockly()
    workspace.clear()
    serialization.workspaces.load(state, workspace)
    console.log('Workspace loaded successfully')

    workspace.fireChangeListener(new Events.FinishedLoading(workspace))

    return true
  } catch (error) {
    console.error('Error loading workspace:', error)
    return false
  }
}
