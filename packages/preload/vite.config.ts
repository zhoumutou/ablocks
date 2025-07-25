import { URL, fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'rolldown-vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), '')

  const isDebugMode = mode === 'debug'
  console.log(`mode: ${mode}, NODE_ENV: ${env.NODE_ENV}`)

  return {
    appType: 'custom',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    ssr: {
      noExternal: true,
    },
    build: {
      ssr: true,
      target: 'node22',
      lib: {
        entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        formats: ['cjs'],
      },
      emptyOutDir: true,
      sourcemap: isDebugMode,
      minify: isDebugMode ? false : 'oxc',
      rollupOptions: {
        output: {
          format: 'cjs',
          entryFileNames: '[name].js',
        },
        external: [
          'electron',
        ],
      },
    },
  }
})
