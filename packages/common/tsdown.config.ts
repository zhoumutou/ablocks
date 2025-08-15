import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: [
      'src/messages/index.ts',
      'src/utils/index.ts',
    ],
    format: ['cjs', 'esm'],
    dts: false,
    sourcemap: true,
    minify: true,
    silent: true,
  },
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: false,
    sourcemap: true,
    minify: true,
    silent: true,
  },
  {
    entry: [
      'src/messages/index.ts',
      'src/utils/index.ts',
    ],
    format: ['esm'],
    dts: {
      emitDtsOnly: true,
    },
    silent: true,
  },
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: {
      emitDtsOnly: true,
    },
    silent: true,
  },
])
