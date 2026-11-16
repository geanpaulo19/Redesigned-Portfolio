import { useLenis } from 'lenis/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { availability, contact } from '@/data/site'
import {
  buildInquiryMailto,
  ContactSubmitError,
  sendContactMessage,
  validateContactDraft,
  type ContactDraft,
  type ContactErrors,
  type ContactFailureCode,
} from '@/lib/contact'
import { cn } from '@/lib/utils'

const EMPTY_DRAFT: ContactDraft = {
  name: '',
  email: '',
  project: 'Not sure yet',
  message: '',
  company: '',
}

const PROJECT_OPTIONS = [
  'Not sure yet',
  'Website',
  'Landing page',
  'GHL automation',
  'Branding and design',
  'SEO',
  'Something else',
] as const

type Status = 'idle' | 'sending' | 'success'

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? ''
}

function fieldClass(invalid: boolean) {
  return cn(
    'w-full rounded-xl border bg-foreground/[0.04] px-3.5 text-base text-foreground caret-accent transition-[border-color,background-color,box-shadow] duration-200',
    'placeholder:text-muted-foreground hover:border-foreground/25 focus:bg-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2',
    invalid
      ? 'border-red-400/60 focus:border-red-400/80 focus-visible:ring-red-300/25'
      : 'border-border focus:border-accent/70 focus-visible:ring-accent/25',
  )
}

type ContactModalProps = {
  open: boolean
  onClose: () => void
}

/**
 * Contact form in a native modal dialog.
 *
 * The native <dialog> gives us focus trapping, Escape handling, and top-layer
 * stacking for free, which matters here: the Cal.com button lives above
 * every z-index on the page, but not above the top layer.
 */
export function ContactModal({ open, onClose }: ContactModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const successCloseRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  const [draft, setDraft] = useState<ContactDraft>(EMPTY_DRAFT)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [failure, setFailure] = useState<ContactFailureCode | null>(null)
  const [sentTo, setSentTo] = useState({ name: '', email: '' })

  const lenis = useLenis()

  // Open and close the native dialog with the prop.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      // Only grab the keyboard on pointer devices. On phones, opening the
      // keyboard on top of a fresh dialog feels like a jump scare.
      if (window.matchMedia('(pointer: fine)').matches) {
        requestAnimationFrame(() => nameRef.current?.focus())
      }
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Clear stale errors and the success screen on the next open.
  useEffect(() => {
    if (open && !wasOpen.current) {
      if (status === 'success') {
        setDraft(EMPTY_DRAFT)
        setSentTo({ name: '', email: '' })
        setStatus('idle')
      }
      setErrors({})
      setFailure(null)
    }
    wasOpen.current = open
  }, [open, status])

  // Stop the page (and Lenis) from scrolling behind the dialog.
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lenis?.stop()

    return () => {
      document.body.style.overflow = previousOverflow
      lenis?.start()
    }
  }, [open, lenis])

  // The submit button disappears when the form is replaced. Put keyboard
  // focus somewhere useful instead of letting it fall back to the page.
  useEffect(() => {
    if (status === 'success') {
      requestAnimationFrame(() => successCloseRef.current?.focus())
    }
  }, [status])

  const updateField = (field: 'name' | 'email' | 'project' | 'message', value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setFailure(null)

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current }
        delete next[field]
        return next
      })
    }
  }

  const resetForAnother = () => {
    setDraft(EMPTY_DRAFT)
    setSentTo({ name: '', email: '' })
    setStatus('idle')
    setErrors({})
    setFailure(null)
    requestAnimationFrame(() => nameRef.current?.focus())
  }

  const dismiss = () => {
    const dialog = dialogRef.current
    if (dialog?.open) dialog.close()
    else onClose()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return

    const nextErrors = validateContactDraft(draft)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const first = (['name', 'email', 'message'] as const).find((field) => nextErrors[field])
      if (first === 'name') nameRef.current?.focus()
      else if (first === 'email') emailRef.current?.focus()
      else if (first === 'message') messageRef.current?.focus()
      return
    }

    setStatus('sending')
    setFailure(null)

    try {
      await sendContactMessage(draft)
      setSentTo({ name: draft.name.trim(), email: draft.email.trim() })
      setStatus('success')
    } catch (error) {
      if (import.meta.env.DEV) console.warn('[contact]', error)
      setFailure(error instanceof ContactSubmitError ? error.code : 'network')
      setStatus('idle')
    }
  }

  const mailtoHref = buildInquiryMailto(draft, contact.email)

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="contact-title"
      aria-describedby="contact-description"
      className="contact-dialog m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-2xl overflow-hidden bg-transparent p-0 text-foreground"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dismiss()
      }}
    >
      <div className="relative max-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-2xl border border-border bg-card">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 size-56 rounded-full bg-accent/[0.06] blur-3xl"
        />

        <div
          data-lenis-prevent
          className="relative max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain"
        >
          {/* Sticky so the close control stays reachable on short screens. */}
          <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border/60 bg-card px-5 py-3.5 sm:px-8">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
            />
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  availability.open ? 'bg-accent' : 'bg-muted-foreground',
                )}
                aria-hidden="true"
              />
              {availability.open ? availability.available : availability.booked}
            </p>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close contact form"
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-200 hover:border-foreground/30 hover:text-foreground active:scale-[0.97] sm:size-9"
            >
              <i className="ph ph-x text-base" aria-hidden="true" />
            </button>
          </div>

          <div className="relative px-5 pb-5 sm:px-8 sm:pb-8">
            {status === 'success' ? (
              <div role="status" className="dialog-reveal py-8 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-background">
                  <i className="ph ph-check text-2xl" aria-hidden="true" />
                </span>
                <h2
                  id="contact-title"
                  className="font-display mt-6 text-3xl font-semibold tracking-tight"
                  style={{ fontStretch: '106%' }}
                >
                  Message sent.
                </h2>
                <p
                  id="contact-description"
                  className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground"
                >
                  Thanks{sentTo.name ? `, ${firstName(sentTo.name)}` : ''}. I&rsquo;ll reply to{' '}
                  <span className="break-all text-foreground">{sentTo.email}</span> within two
                  working days.
                </p>
                <div className="mt-8 flex flex-col items-center gap-4">
                  <Button
                    ref={successCloseRef}
                    type="button"
                    onClick={dismiss}
                    className="rounded-full px-8"
                  >
                    Close
                  </Button>
                  <button
                    type="button"
                    onClick={resetForAnother}
                    className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2
                  id="contact-title"
                  className="font-display mt-7 text-3xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-[2.5rem]"
                  style={{ fontStretch: '106%' }}
                >
                  Tell me what you&rsquo;re building.
                </h2>
                <p
                  id="contact-description"
                  className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground"
                >
                  A few details are enough to start. I reply personally, usually within two working
                  days.
                </p>

                <form noValidate onSubmit={handleSubmit} className="mt-7">
                  {failure && (
                    <div
                      role="alert"
                      className="dialog-reveal mb-5 flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-400/[0.06] p-3.5"
                    >
                      <i
                        className="ph ph-warning-circle mt-0.5 shrink-0 text-lg text-red-300"
                        aria-hidden="true"
                      />
                      <p className="text-sm leading-relaxed text-red-100">
                        {failure === 'not-configured' ? (
                          <>
                            This form isn&rsquo;t connected yet, but you can{' '}
                            <a
                              href={mailtoHref}
                              className="underline decoration-red-300/50 underline-offset-2 hover:decoration-red-200"
                            >
                              email me directly
                            </a>
                            .
                          </>
                        ) : (
                          <>
                            That didn&rsquo;t send. Try again, or{' '}
                            <a
                              href={mailtoHref}
                              className="underline decoration-red-300/50 underline-offset-2 hover:decoration-red-200"
                            >
                              email me directly
                            </a>
                            .
                          </>
                        )}
                      </p>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="contact-name"
                        className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
                      >
                        Name
                      </label>
                      <input
                        ref={nameRef}
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your name"
                        value={draft.name}
                        onChange={(event) => updateField('name', event.target.value)}
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={errors.name ? 'contact-name-error' : undefined}
                        className={cn(fieldClass(Boolean(errors.name)), 'h-11')}
                      />
                      {errors.name && (
                        <p id="contact-name-error" className="text-xs leading-relaxed text-red-300">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="contact-email"
                        className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
                      >
                        Email
                      </label>
                      <input
                        ref={emailRef}
                        id="contact-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        placeholder="you@company.com"
                        value={draft.email}
                        onChange={(event) => updateField('email', event.target.value)}
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={errors.email ? 'contact-email-error' : undefined}
                        className={cn(fieldClass(Boolean(errors.email)), 'h-11')}
                      />
                      {errors.email && (
                        <p
                          id="contact-email-error"
                          className="text-xs leading-relaxed text-red-300"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <label
                      htmlFor="contact-project"
                      className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
                    >
                      Project
                    </label>
                    <div className="relative">
                      <select
                        id="contact-project"
                        name="project"
                        value={draft.project}
                        onChange={(event) => updateField('project', event.target.value)}
                        className={cn(fieldClass(false), 'h-11 appearance-none pr-10')}
                      >
                        {PROJECT_OPTIONS.map((option) => (
                          <option key={option} value={option} className="bg-card text-foreground">
                            {option}
                          </option>
                        ))}
                      </select>
                      <i
                        className="ph ph-caret-down pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <label
                        htmlFor="contact-message"
                        className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
                      >
                        Project details
                      </label>
                      <span
                        className="font-mono text-[10px] tabular-nums text-muted-foreground"
                        aria-hidden="true"
                      >
                        {draft.message.length}/2000
                      </span>
                    </div>
                    <textarea
                      ref={messageRef}
                      id="contact-message"
                      name="message"
                      rows={4}
                      maxLength={2000}
                      placeholder="Goals, timeline, budget, links. Anything that helps me understand the job."
                      value={draft.message}
                      onChange={(event) => updateField('message', event.target.value)}
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      className={cn(
                        fieldClass(Boolean(errors.message)),
                        'min-h-32 resize-y py-3 leading-relaxed',
                      )}
                    />
                    {errors.message && (
                      <p
                        id="contact-message-error"
                        className="text-xs leading-relaxed text-red-300"
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Honeypot: off-screen, not focusable, never announced. */}
                  <div
                    aria-hidden="true"
                    className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
                  >
                    <label htmlFor="contact-company">Company</label>
                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={draft.company}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, company: event.target.value }))
                      }
                    />
                  </div>

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      disabled={status === 'sending'}
                      aria-busy={status === 'sending'}
                      className="h-12 rounded-full px-7 text-[15px] active:scale-[0.99]"
                    >
                      {status === 'sending' ? (
                        <>
                          <i
                            className="ph ph-circle-notch motion-safe:animate-spin"
                            aria-hidden="true"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send message
                          <i className="ph ph-arrow-up-right" aria-hidden="true" />
                        </>
                      )}
                    </Button>
                    <a
                      href={mailtoHref}
                      className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      or email {contact.email}
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </dialog>
  )
}
