#!/usr/bin/env -S npx tsx

import process from 'node:process'
import { URL, fileURLToPath } from 'node:url'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { createServer } from 'rolldown-vite'
import getPort from 'get-port'

async function main() {
  const rootDir = fileURLToPath(new URL('..', import.meta.url))
  const configFile = path.resolve(rootDir, 'vite.config.ts')

  console.log('[renderer] generate types')

  const server = await createServer({
    configFile,
    root: rootDir,
    logLevel: 'silent',
  })

  const port = await getPort()
  // 启动服务器（这会触发插件初始化）
  const devServer = await server.listen(port)
  console.log(`[renderer] server ${devServer.resolvedUrls?.local}`)

  // 等待3秒让插件生成类型文件
  await new Promise(resolve => setTimeout(resolve, 3000))

  // 关闭服务器
  await server.close()

  // 检查类型文件
  const autoImportsPath = path.resolve(rootDir, './src/types/auto-imports.d.ts')
  const exists = existsSync(autoImportsPath)
  console.log(`[renderer] generate types ${exists ? 'success' : 'fail'}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
