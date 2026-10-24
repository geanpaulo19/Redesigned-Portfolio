import { useEffect, useState } from 'react'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Journal', href: '#journal' },
  { label: 'Reach', href: '#reach' },
]

/**
 * Fixed nav. Solid white text over a soft top gradient so it stays
 * legible over the hero video, bright thumbnails, and every section.
 * The link for the section currently in view gets a lime underline.
 */
export function SiteNav() {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      // a thin band around the viewport's upper-middle decides
      // which section "owns" the current scroll position
      { rootMargin: '-40% 0px -55% 0px' },
    )

    links
      .map((link) => document.getElementById(link.href.slice(1)))
      .forEach((section) => section && observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-background/90 via-background/50 to-transparent"
    >
      <div className="flex items-center justify-between px-6 py-5 text-white md:px-8">
        <a href="#home" className="font-display text-lg font-semibold tracking-tight" style={{ fontStretch: '105%' }}>
          Gean Paulo<sup className="text-[10px]">&reg;</sup>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const id = link.href.slice(1)
            const isActive = active === id
            return (
              <a
                key={link.label}
                href={link.href}
                aria-current={isActive ? 'true' : undefined}
                className="relative font-mono text-[11px] uppercase tracking-[0.18em] text-white opacity-80 transition-opacity hover:opacity-100"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            )
          })}
        </div>

        <a
          href="#reach"
          className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-80 transition-opacity hover:opacity-100 md:hidden"
        >
          Reach
        </a>
      </div>
    </nav>
  )
}
