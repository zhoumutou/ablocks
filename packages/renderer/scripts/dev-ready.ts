#!/usr/bin/env -S npx tsx

import process from 'node:process'
import { URL, fileURLToPath } from 'node:url'
import waitOn from 'wait-on'
import { loadEnv } from 'rolldown-vite'

async function main() {
  const env = loadEnv('dev', fileURLToPath(new URL('..', import.meta.url)), '')

  const port = env.PORT || '5173'
  console.log(`[renderer] waiting port ${port}`)

  await waitOn({ resources: [`tcp:${port}`] })

  console.log('[renderer] dev is ready')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
