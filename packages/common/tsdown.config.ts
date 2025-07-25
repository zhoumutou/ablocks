import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: [
      'src/messages/index.ts',
      'src/utils/index.ts',
    ],
    format: ['cjs', 'esm'],
    sourcemap: true,
    minify: true,
    silent: true,
  },
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    sourcemap: true,
    minify: true,
    silent: true,
  },
])
