/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NODE_ENV: string
  readonly VITE_APP_TITLE: string
  // 다른 환경 변수들...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const process: {
  env: {
    NODE_ENV: string
    [key: string]: string | undefined
  }
}
