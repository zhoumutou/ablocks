import { join } from 'node:path'
import log from 'electron-log/main'
import { getDate } from '@ablocks/common/utils'

export function initLogger(options: { debugMode: boolean, logDir: string }) {
  const { debugMode, logDir } = options

  Object.assign(console, log.functions)

  log.initialize({ spyRendererConsole: true, preload: false })

  log.transports.console.level = import.meta.env.MODE === 'dev' ? 'info' : debugMode ? 'info' : 'error'
  log.transports.file.level = import.meta.env.MODE === 'dev' ? false : debugMode ? 'info' : 'error'
  log.transports.file.sync = false
  log.transports.file.resolvePathFn = () => join(logDir, `${getDate()}.log`)

  log.errorHandler.startCatching()
  log.eventLogger.startLogging()
}
