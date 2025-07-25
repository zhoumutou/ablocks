import { URL, fileURLToPath } from 'node:url'
import { builtinModules } from 'node:module'
import { defineConfig, loadEnv } from 'rolldown-vite'
import { analyzer } from 'vite-bundle-analyzer'

const NATIVE_DEPS = ['serialport']

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), '')

  const isDebugMode = mode === 'debug'
  console.log(`mode: ${mode}, NODE_ENV: ${env.NODE_ENV}, API_BASE: ${env.API_BASE}, RENDERER_DEV_URL: ${env.RENDERER_DEV_URL}`)

  return {
    appType: 'custom',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      'import.meta.env.API_BASE': JSON.stringify(env.API_BASE),
      'import.meta.env.RENDERER_DEV_URL': JSON.stringify(env.RENDERER_DEV_URL),
    },
    plugins: [
      isDebugMode && analyzer(),
    ],
    ssr: {
      noExternal: true,
    },
    build: {
      ssr: true,
      target: 'node22',
      lib: {
        entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        formats: ['es'],
      },
      emptyOutDir: true,
      sourcemap: isDebugMode,
      minify: isDebugMode ? false : 'oxc',
      rollupOptions: {
        output: {
          entryFileNames: '[name].js',
        },
        external: [
          'electron',
          ...NATIVE_DEPS,
          ...builtinModules,
          ...builtinModules.map(m => `node:${m}`),
        ],
      },
    },
  }
})
