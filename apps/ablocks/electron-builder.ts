import type { Configuration } from 'electron-builder'
import dayjs from 'dayjs'

const RELEASE_TIME = dayjs().toISOString()

const config: Configuration = {
  appId: `edu.blockly.ablocks`,
  electronLanguages: ['zh-CN', 'en-US'],
  extraMetadata: {
    metadata: {},
  },
  async beforePack() {
    config.extraMetadata.metadata.releaseTime = RELEASE_TIME
  },
  artifactName: `\${productName}-\${version}-\${arch}.\${ext}`,
  mac: {
    category: 'public.app-category.productivity',
    electronLanguages: ['zh-CN', 'en'],
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64'],
      },
      {
        target: 'zip',
        arch: ['x64', 'arm64'],
      },
    ],
  },
  dmg: {
    window: {
      width: 540,
      height: 484,
    },
    contents: [
      {
        x: 410,
        y: 200,
        type: 'link',
        path: '/Applications',
      },
      {
        x: 130,
        y: 200,
        type: 'file',
      },
    ],
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
  },
  nsis: {
    shortcutName: `\${productName}`,
    oneClick: false,
    allowToChangeInstallationDirectory: true,
  },
  files: [
    '!pnpm-workspace.yaml',
    '!dev-app-update.yml',
    '!**/*.ts',
    '!**/*.map',
    '!**/tsconfig*.json',
    '!**/*.md',
    '!node_modules/@serialport/bindings-cpp/src',
    '!node_modules/@serialport/bindings-cpp/prebuilds',
    '!node_modules/@serialport/bindings-cpp/build/bindings*',
    '!node_modules/@serialport/bindings-cpp/build/Release/obj',
    '!node_modules/@serialport/bindings-cpp/build/Release/bindings.{exp,iobj,ipdb,lib}',
  ],
  publish: {
    provider: 'generic',
    url: 'http://localhost/updates/',
  },
}

export default config
