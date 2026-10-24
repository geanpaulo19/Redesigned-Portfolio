const links = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Journal', href: '#journal' },
  { label: 'Reach', href: '#reach' },
]

/**
 * Fixed nav rendered with mix-blend-difference so it stays legible
 * over the hero video and every section below it.
 */
export function SiteNav() {
  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="fixed inset-x-0 top-0 z-40 mix-blend-difference"
    >
      <div className="flex items-center justify-between px-6 py-5 text-white md:px-8">
        <a href="#home" className="font-display text-lg font-semibold tracking-tight" style={{ fontStretch: '105%' }}>
          Gean Paulo<sup className="text-[10px]">&reg;</sup>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-80 transition-opacity hover:opacity-100"
            >
              {link.label}
            </a>
          ))}
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
