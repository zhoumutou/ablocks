import { Buffer } from 'node:buffer'
import { AppInvoke, FileInvoke, DialogInvoke } from '@ablocks/common/messages'
import { getAppMeta, getAppVersion, getVersionMeta, ipc } from '@/utils'
import { ensureDir, pathExists, readFile, readJson, writeFile, writeJson } from 'fs-extra'
import { BrowserWindow, dialog } from 'electron'

export default function listen() {
  console.log('[message] listen app messages')

  ipc.handle(AppInvoke.getAppMeta, getAppMeta)
  ipc.handle(AppInvoke.getVersion, getAppVersion)
  ipc.handle(AppInvoke.getVersionMeta, getVersionMeta)

  ipc.handle(FileInvoke.readText, async (_event, file) => {
    return readFile(file, { encoding: 'utf8' })
  })
  ipc.handle(FileInvoke.writeText, async (_event, file, data) => {
    await writeFile(file, data, { encoding: 'utf8' })
    return true
  })
  ipc.handle(FileInvoke.readJson, async (_event, file) => {
    return readJson(file, { encoding: 'utf8' })
  })
  ipc.handle(FileInvoke.writeJson, async (_event, file, data, { spaces } = {}) => {
    await writeJson(file, data, { spaces, encoding: 'utf8' })
    return true
  })
  ipc.handle(FileInvoke.readFile, async (_event, file) => {
    return readFile(file, { encoding: null })
  })
  ipc.handle(FileInvoke.writeFile, async (_event, file, data) => {
    if (Buffer.isBuffer(data)) {
      await writeFile(file, data)
      return true
    } else if (data instanceof Uint8Array) {
      await writeFile(file, Buffer.from(data.buffer, data.byteOffset, data.byteLength))
      return true
    } else if (data instanceof ArrayBuffer) {
      await writeFile(file, Buffer.from(data))
      return true
    }

    return false
  })
  ipc.handle(FileInvoke.ensureDir, async (_event, dir) => {
    await ensureDir(dir)
    return true
  })
  ipc.handle(FileInvoke.pathExists, async (_event, path) => {
    return pathExists(path)
  })

  ipc.handle(DialogInvoke.showOpenDialog, async (event, options) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) {
      return
    }

    const { filePaths } = await dialog.showOpenDialog(win, {
      ...options,
      properties: [...(options?.properties || []), 'createDirectory', 'dontAddToRecent'],
    })
    return filePaths
  })
  ipc.handle(DialogInvoke.showSaveDialog, async (event, options) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) {
      return
    }

    const { filePath } = await dialog.showSaveDialog(win, {
      ...options,
      properties: ['createDirectory', 'showOverwriteConfirmation', 'dontAddToRecent'],
    })
    return filePath
  })
}
