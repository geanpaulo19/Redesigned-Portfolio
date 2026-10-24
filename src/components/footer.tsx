import { useEffect, useState } from 'react'

import { footnotes, socials } from '@/data/site'

export function Footer() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % footnotes.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <footer className="overflow-hidden border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pt-10 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="text-sm text-muted-foreground" aria-live="off">
          <span key={index} className="inline-block animate-fade-rise">
            {footnotes[index]}
          </span>
        </p>

        <nav aria-label="Social links" className="flex flex-wrap gap-x-7 gap-y-2">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground opacity-80 transition-opacity hover:opacity-100"
            >
              {social.label}
            </a>
          ))}
        </nav>
      </div>

      <p
        aria-hidden="true"
        className="font-display -mb-[0.16em] mt-6 text-center text-[13.5vw] leading-none font-extrabold tracking-[-0.03em] text-foreground/[0.06] select-none"
        style={{ fontStretch: '112%' }}
      >
        GEAN PAULO
      </p>

      <div className="mx-auto w-full max-w-7xl px-6 pt-8 pb-6 md:px-8">
        <p className="font-mono text-[11px] text-muted-foreground">
          &copy; {new Date().getFullYear()} Gean Paulo
        </p>
      </div>
    </footer>
  )
}
