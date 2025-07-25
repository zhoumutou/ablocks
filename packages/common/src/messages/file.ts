import type { BinaryData, JsonValue } from './types'

export enum FileInvoke {
  readText = 'file:readText',
  writeText = 'file:writeText',
  readJson = 'file:readJson',
  writeJson = 'file:writeJson',
  readFile = 'file:readFile',
  writeFile = 'file:writeFile',
  ensureDir = 'file:ensureDir',
  pathExists = 'file:pathExists',
}

export interface FileInvokeMap {
  /**
   * 读取文件
   * @param file 文件路径
   * @returns 文件内容
   */
  [FileInvoke.readText]: (file: string) => Promise<string>
  [FileInvoke.writeText]: (file: string, data: string) => Promise<boolean>
  [FileInvoke.readJson]: (file: string) => Promise<JsonValue>
  [FileInvoke.writeJson]: (file: string, data: JsonValue, options?: { spaces?: number }) => Promise<boolean>
  [FileInvoke.readFile]: (file: string) => Promise<BinaryData>
  [FileInvoke.writeFile]: (file: string, data: BinaryData) => Promise<boolean>
  [FileInvoke.ensureDir]: (dir: string) => Promise<boolean>
  [FileInvoke.pathExists]: (path: string) => Promise<boolean>
}
