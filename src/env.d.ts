/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SMTP_HOST: string;
  readonly SMTP_PORT: string;
  readonly SMTP_SECURE: string;
  readonly SMTP_USER: string;
  readonly SMTP_PASS: string;
  // readonly ASTRO_PUBLIC_API_KEY: string; // Jeśli masz publiczne
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}