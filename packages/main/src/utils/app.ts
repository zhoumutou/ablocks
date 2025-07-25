import process from 'node:process'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { app } from 'electron'
import { readJsonSync } from 'fs-extra'
import { memoize } from 'lodash-es'
import { getDate } from '@ablocks/common'

export const isMac = process.platform === 'darwin'
export const isWindows = process.platform === 'win32'
export const isLinux = process.platform === 'linux'

interface PackageInfo {
  name: string
  productName: string
  version: string
  metadata: {
    releaseTime: string
  }
}

function getMockBuildInfo() {
  return {
    releaseTime: getDate(undefined, 'YYYY-MM-DD HH:mm:ss'),
  }
}

const getPackageInfo = memoize(() => {
  const dir = fileURLToPath(new URL('.', import.meta.url))
  const info = readJsonSync(path.resolve(dir, '../package.json'))
  const { name, productName, version, metadata } = info as PackageInfo

  return {
    name,
    productName,
    version,
    metadata: app.isPackaged ? metadata : getMockBuildInfo(),
  }
})

export function getAppVersion() {
  const packageInfo = getPackageInfo()
  return packageInfo.version || app.getVersion()
}

export function getVersionMeta() {
  const { node, chrome, electron } = process.versions
  return { node, chrome, electron, app: getAppVersion() }
}

export function getAppName() {
  const packageInfo = getPackageInfo()
  return packageInfo.name || app.getName()
}

export function getAppProductName() {
  const packageInfo = getPackageInfo()
  return packageInfo.productName || app.getName()
}

export function getAppMeta() {
  const packageInfo = getPackageInfo()
  return {
    name: getAppName(),
    productName: getAppProductName(),
    version: getAppVersion(),
    releaseTime: packageInfo.metadata.releaseTime,
  }
}

export function getOSInfo() {
  return `${os.type()} ${os.arch()} ${os.release()} (${os.platform()})`
}
