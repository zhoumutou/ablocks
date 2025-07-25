/// <reference types="vite/client" />

interface ImportMetaEnv {
  MODE: string
  BASE_URL: string
  PROD: boolean
  DEV: boolean
  SSR: boolean

  API_BASE: string
  RENDERER_DEV_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
