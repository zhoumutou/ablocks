#!/usr/bin/env -S npx tsx

import process from 'node:process'
import { URL, fileURLToPath } from 'node:url'
import path from 'node:path'
import { rimraf } from 'rimraf'
import cpy from 'cpy'
import arg from 'arg'

const ALL = 'all'
const NAMES = ['main', 'preload', 'renderer']

function getTasks(name = ALL) {
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  const appDir = path.resolve(__dirname, '../app')
  const packagesDir = path.resolve(__dirname, '../../../packages')

  let list: string[]
  if (!name || name === ALL) {
    list = NAMES
  } else {
    const names = name.split(',').filter(Boolean)
    list = NAMES.filter(dir => names.includes(dir))
  }

  return list.map(dir => ({
    from: path.join(packagesDir, `${dir}/dist/**`),
    to: path.join(appDir, dir),
    name: dir,
  }))
}

async function main() {
  const spec = {
    '--name': String,
  }
  const argv = process.argv.slice(2)
  const args = arg(spec, { permissive: true, argv })

  const tasks = getTasks(args['--name'])

  if (tasks.length === 0) {
    console.log(`skip copy dist`)
    return
  }

  await rimraf(tasks.map(it => it.to))
  await Promise.all(tasks.map(it => cpy(it.from, it.to)))

  console.log(`copy ${tasks.map(it => it.name).join(',')} dist success`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
