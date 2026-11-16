/**
 * Contact form contract.
 *
 * The site is static, so submissions go to a Google Apps Script web app
 * (see `google-apps-script/Code.gs`) that appends a row to a Google Sheet.
 * The `text/plain` content type is deliberate: it keeps the request a
 * "simple" CORS request, so the browser skips the OPTIONS preflight that
 * Apps Script cannot answer. The body is still JSON and is parsed there.
 */

export type ContactDraft = {
  name: string
  email: string
  project: string
  message: string
  /** Honeypot. Hidden from people, tempting to bots. */
  company: string
}

export type ContactField = 'name' | 'email' | 'project' | 'message'
export type ContactErrors = Partial<Record<ContactField, string>>

export type ContactFailureCode = 'not-configured' | 'network' | 'server'

export class ContactSubmitError extends Error {
  code: ContactFailureCode

  constructor(code: ContactFailureCode, message: string) {
    super(message)
    this.name = 'ContactSubmitError'
    this.code = code
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const REQUEST_TIMEOUT_MS = 20_000

export const CONTACT_ENDPOINT = (import.meta.env.VITE_CONTACT_ENDPOINT ?? '').trim()

if (import.meta.env.DEV && !CONTACT_ENDPOINT) {
  console.warn(
    '[contact] VITE_CONTACT_ENDPOINT is not set. The form will offer the email fallback. See docs/contact-form-setup.md.',
  )
}

/** Client-side mirror of the server checks. Keeps feedback instant and specific. */
export function validateContactDraft(draft: ContactDraft): ContactErrors {
  const errors: ContactErrors = {}
  const name = draft.name.trim()
  const email = draft.email.trim()
  const message = draft.message.trim()

  if (name.length < 2) {
    errors.name = 'Tell me your name so I know who I am replying to.'
  }

  if (!email) {
    errors.email = 'Add an email address so I can get back to you.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'That email address looks incomplete.'
  }

  if (message.length < 10) {
    errors.message = 'A sentence or two about the project, please.'
  }

  return errors
}

/** Fallback used when the endpoint is missing or the request fails. */
export function buildInquiryMailto(draft: ContactDraft, to: string): string {
  const name = draft.name.trim()
  const subject = name ? `Project inquiry from ${name}` : 'Project inquiry'
  const lines = [
    name ? `Name: ${name}` : '',
    draft.email.trim() ? `Email: ${draft.email.trim()}` : '',
    draft.project ? `Project: ${draft.project}` : '',
    '',
    draft.message.trim(),
  ]
  const body = lines.join('\n').trim()

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export async function sendContactMessage(draft: ContactDraft): Promise<void> {
  if (!CONTACT_ENDPOINT) {
    throw new ContactSubmitError(
      'not-configured',
      'VITE_CONTACT_ENDPOINT is not set. See docs/contact-form-setup.md.',
    )
  }

  const payload = {
    name: draft.name.trim(),
    email: draft.email.trim(),
    project: draft.project.trim(),
    message: draft.message.trim(),
    company: draft.company,
    page: window.location.href,
    referrer: document.referrer,
  }

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new ContactSubmitError(
        'server',
        `The form service returned HTTP ${response.status}.`,
      )
    }

    let result: { ok?: boolean; error?: string } | null = null
    try {
      result = (await response.json()) as { ok?: boolean; error?: string }
    } catch {
      throw new ContactSubmitError(
        'server',
        'The form service returned a response the browser could not read.',
      )
    }

    if (!result || result.ok !== true) {
      throw new ContactSubmitError(
        'server',
        result?.error || 'The form service rejected the message.',
      )
    }
  } catch (error) {
    if (error instanceof ContactSubmitError) throw error

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ContactSubmitError('network', 'The request took too long to complete.')
    }

    throw new ContactSubmitError('network', 'Could not reach the form service.')
  } finally {
    window.clearTimeout(timeout)
  }
}
