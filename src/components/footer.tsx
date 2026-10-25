import { useEffect, useState } from 'react'

import { footnotes, socials } from '@/data/site'

/** Live viewport readout - a small front-end developer flex. */
function useViewport() {
  const [size, setSize] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }))

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return size
}

export function Footer() {
  const [index, setIndex] = useState(0)
  const viewport = useViewport()

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
        className="font-display -mb-[0.16em] mt-6 bg-cover bg-center bg-clip-text bg-[url(/assets/images/footer-mask.jpg)] bg-[#17171b] text-center text-[13.5vw] leading-none font-extrabold tracking-[-0.03em] text-transparent select-none"
        style={{ fontStretch: '112%' }}
      >
        GEAN PAULO
      </p>

      <div className="mx-auto w-full max-w-7xl px-6 pt-8 pb-6 md:px-8">
        <p className="font-mono text-[11px] text-muted-foreground">
          &copy; {new Date().getFullYear()} Gean Paulo
          <span className="opacity-40"> &middot; </span>
          <span className="tabular-nums" aria-hidden="true">
            {viewport.width} &times; {viewport.height}
          </span>
        </p>
      </div>
    </footer>
  )
}
