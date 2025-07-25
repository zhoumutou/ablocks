import type { CliArgs } from './cli'
import { join, resolve } from 'node:path'
import { URL, fileURLToPath } from 'node:url'
import { app } from 'electron'
import { ensureDirSync } from 'fs-extra'
import global from '@/global'
import { getAppName } from '@/utils'
import { initLogger } from '@/logger'
import { cli } from './cli'
import { create } from './core'

function parseArgs(args: CliArgs) {
  const appName = getAppName()
  const dirName = import.meta.env.MODE === 'dev' ? `${appName}-dev` : appName
  const userDataDir = args.userDataDir ? resolve(args.userDataDir) : join(app.getPath('appData'), dirName)
  const debugMode = args.debugMode ?? !app.isPackaged

  return { debugMode, userDataDir }
}

function setupDirs(userDataDir: string) {
  const dataDir = join(app.getPath('documents'), getAppName(), 'data')
  const logDir = join(userDataDir, 'logs')

  ensureDirSync(userDataDir)
  ensureDirSync(dataDir)
  ensureDirSync(logDir)

  app.setPath('userData', userDataDir)
  app.setPath('logs', logDir)

  return { dataDir, logDir }
}

function start() {
  const { debugMode, userDataDir } = parseArgs(cli())
  const appDir = import.meta.env.MODE === 'dev' ? fileURLToPath(new URL('..', import.meta.url)) : app.getAppPath()

  const { dataDir, logDir } = setupDirs(userDataDir)

  global.env = Object.freeze({
    debugMode,
    appDir,
    dataDir,
    userDataDir,
    logDir,
  })

  initLogger({ debugMode, logDir })
  console.log(`[start] isDev = ${import.meta.env.MODE === 'dev'}, env: \n${JSON.stringify(global.env, null, 2)}`)

  create()
}

start()
