import type { OpenDialogOptions, SaveDialogOptions } from './types'

export enum DialogInvoke {
  showOpenDialog = 'dialog:showOpenDialog',
  showSaveDialog = 'dialog:showSaveDialog',
}

export interface DialogInvokeMap {
  [DialogInvoke.showOpenDialog]: (options?: OpenDialogOptions) => Promise<string[] | undefined>
  [DialogInvoke.showSaveDialog]: (options?: SaveDialogOptions) => Promise<string | undefined>
}
