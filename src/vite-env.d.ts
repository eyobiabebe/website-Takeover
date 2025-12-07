/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  // add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
