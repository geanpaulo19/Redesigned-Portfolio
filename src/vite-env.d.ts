/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Apps Script Web App URL for the contact form. See docs/contact-form-setup.md. */
  readonly VITE_CONTACT_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
