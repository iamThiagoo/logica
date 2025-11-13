/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_APP_MODULE: string;
  readonly VITE_APP_MS_AUTH: string;
  readonly VITE_APP_MS_BACK_ENG: string;
  readonly VITE_APP_MS_DOCS: string;
  readonly VITE_APP_MS_DRIVE: string;
  readonly VITE_APP_MS_INS: string;
  readonly VITE_APP_MS_PRODESK: string;
  readonly VITE_APP_MS_VND: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;
