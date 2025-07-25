import type { BinaryLike } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { randomBytes, createHash } from 'node:crypto'

export const sha256 = (input: BinaryLike) => createHash('sha256').update(input).digest('hex')

export async function getChecksum(filePath: string) {
  const data = await readFile(filePath, 'binary')
  return `sha256:${sha256(data)}`
}

export {
  randomBytes,
}
