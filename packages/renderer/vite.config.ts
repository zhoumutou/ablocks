import { URL, fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig, loadEnv } from 'rolldown-vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Tailwindcss from '@tailwindcss/vite'
// import Markdown from 'unplugin-vue-markdown/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Remove from 'unplugin-remove/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import { analyzer } from 'vite-bundle-analyzer'

function buildTestRegExp(deps: string[]) {
  const seperator = '[\\/]'
  const items = deps.map(it => it.replace('/', seperator))

  return new RegExp(`${seperator}node_modules${seperator}(${items.join('|')})`)
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  const env = loadEnv(mode, __dirname, '')

  const isDebugMode = mode === 'debug'
  const isProduction = env.NODE_ENV === 'production'
  console.log(`mode: ${mode}, NODE_ENV: ${env.NODE_ENV}${isProduction ? '' : `, PORT: ${env.PORT}`}`)

  const customIconNamespace = 'ab'

  return {
    define: {
      'import.meta.env.API_BASE': JSON.stringify(env.API_BASE),
    },
    server: {
      strictPort: true,
      port: Number.parseInt(env.PORT || '') || undefined,
      cors: true,
    },
    plugins: [
      // Vue({ include: [/\.vue$/, /\.md$/] }),
      Vue(),
      VueJsx(),
      Tailwindcss(),
      // Markdown({}),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: path.resolve(__dirname, './src/types/auto-imports.d.ts'),
        eslintrc: {
          enabled: true,
          filepath: path.resolve(__dirname, './src/types/auto-imports.json'),
        },
      }),
      Components({
        dts: './src/types/components.d.ts',
        dirs: [],
        resolvers: [
          IconsResolver({
            customCollections: [customIconNamespace],
          }),
          NaiveUiResolver(),
        ],
      }),
      Icons({
        compiler: 'vue3',
        customCollections: {
          [customIconNamespace]: FileSystemIconLoader(path.resolve(__dirname, './src/assets/icons')),
        },
      }),
      isProduction && !isDebugMode && Remove({ consoleType: ['debug', 'info', 'log'] }),
      !isProduction && VueDevTools(),
      isDebugMode && analyzer(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      dedupe: ['viem'],
      conditions: ['import', 'module', 'browser', 'default'],
    },
    base: isProduction ? './' : '/',
    build: {
      emptyOutDir: true,
      sourcemap: isDebugMode,
      minify: isDebugMode ? false : 'oxc',
      rollupOptions: {
        output: {
          advancedChunks: {
            groups: [
              {
                name: 'naive-ui',
                test: buildTestRegExp([
                  'naive-ui',
                  '@css-render/plugin-bem',
                  '@css-render/vue3-ssr',
                  'async-validator',
                  'css-render',
                  'csstype',
                  'date-fns',
                  'date-fns-tz',
                  'evtd',
                  'highlight.js',
                  'seemly',
                  'treemate',
                  'vdirs',
                  'vooks',
                  'vueuc',
                  '@emotion/hash',
                  '@juggle/resize-observer',
                ]),
                priority: 35,
              },
              {
                name: 'blockly',
                test: buildTestRegExp([
                  'blockly',
                ]),
                priority: 30,
              },
              {
                name: 'shikijs',
                test: buildTestRegExp([
                  '@shikijs/core',
                  '@shikijs/engine-javascript',
                  '@shikijs/langs',
                  '@shikijs/themes',
                  '@shikijs/types',
                  '@shikijs/vscode-textmate',
                  'hast-util-to-html',
                  'hast-util-whitespace',
                  'character-entities-legacy',
                  'stringify-entities',
                  'character-entities-html4',
                  'html-void-elements',
                  'property-information',
                  'comma-separated-tokens',
                  'space-separated-tokens',
                  'oniguruma-to-es',
                  'oniguruma-parser',
                  'regex-recursion',
                  'regex-utilities',
                  'regex',
                  'zwitch',
                  'ccount',
                ]),
                priority: 25,
              },
              {
                name: 'markdown-sse',
                test: buildTestRegExp([
                  'streaming-markdown',
                  'dompurify',
                ]),
                priority: 20,
              },
              {
                name: 'interactjs',
                test: buildTestRegExp([
                  '@interactjs/utils',
                  '@interactjs/core',
                  '@interactjs/actions',
                  '@interactjs/auto-start',
                  '@interactjs/interact',
                  '@interactjs/modifiers',
                  '@interactjs/snappers',
                ]),
                priority: 15,
              },
              {
                name: 'rxjs',
                test: buildTestRegExp([
                  'rxjs',
                  'tslib',
                ]),
                priority: 10,
              },
              {
                name: 'vue',
                test: buildTestRegExp([
                  '@vue/runtime-core',
                  '@vue/runtime-dom',
                  '@vue/reactivity',
                  '@vue/shared',
                  'vue-router',
                ]),
                priority: 5,
              },
              {
                name: 'vendor',
                test: /[\\/]node_modules[\\/]/,
                priority: 1,
              },
            ],
          },
        },
      },
    },
  }
})
