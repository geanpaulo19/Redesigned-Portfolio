import { ArrowUpRight } from 'lucide-react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'

import { AnimatedHeading } from '@/components/animated-heading'
import { cn } from '@/lib/utils'
import { projects, type Project } from '@/data/projects'

interface DeckInfo {
  progress: MotionValue<number>
  count: number
}

function ProjectCard({
  project,
  index,
  deck,
  deckTop,
}: {
  project: Project
  index: number
  deck?: DeckInfo
  deckTop: number
}) {
  const reduced = useReducedMotion()
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [revealed, setRevealed] = useState(false)
  const domain = useMemo(() => {
    try {
      return new URL(project.url).hostname.replace(/^www\./, '')
    } catch {
      return ''
    }
  }, [project.url])
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 220, damping: 22 })
  const springY = useSpring(rotateY, { stiffness: 220, damping: 22 })

  // Deck mode (mobile): as the next card arrives and covers this one,
  // this card settles back slightly for depth. Outside deck mode the
  // range is unreachable, so scale stays 1.
  const fallbackProgress = useMotionValue(1)
  const deckSource = deck?.progress ?? fallbackProgress
  const isDeckLast = !deck || index >= deck.count - 1
  const deckRange: [number, number] = isDeckLast
    ? [2, 3]
    : [(index + 1) / deck.count, Math.min((index + 2) / deck.count, 1)]
  const deckScale = useTransform(deckSource, deckRange, isDeckLast ? [1, 1] : [1, 0.94])

  // Cards assemble as they enter the viewport - during the pan on
  // desktop, during the vertical scroll on mobile.
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    if (reduced) {
      setRevealed(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  const handleMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
    if (reduced) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * 8)
    rotateX.set(py * -8)
  }

  const resetTilt = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <div
      className={cn(
        'w-full shrink-0 max-lg:sticky sm:w-[400px]',
        revealed ? 'animate-fade-rise' : 'opacity-0',
      )}
      // Deck mode reveals cards one at a time, so the horizontal
      // stagger would just add lag for deep cards. The stick offset
      // comes from the measured header height (inline top is ignored
      // on desktop, where the wrapper is static).
      style={{
        top: deckTop,
        ...(revealed ? { animationDelay: deck ? '0ms' : `${index * 45}ms` } : {}),
      }}
    >
      <motion.a
        ref={cardRef}
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMove}
        onMouseLeave={resetTilt}
        whileHover={reduced ? undefined : { y: -6 }}
        style={
          reduced
            ? undefined
            : { rotateX: springX, rotateY: springY, transformPerspective: 900, scale: deckScale }
        }
        className="spotlight-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        {project.shot && (
          <span className="relative -mx-6 -mt-6 mb-5 block h-44" aria-hidden="true">
            <img
              src={project.shot}
              alt=""
              loading="lazy"
              decoding="async"
              onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
              ref={(img) => {
                if (img?.complete && img.naturalWidth > 0) img.classList.remove('opacity-0')
              }}
              className="h-full w-full object-cover object-top opacity-0 transition-opacity duration-700"
            />
            <span className="absolute inset-0 bg-gradient-to-b from-transparent from-45% to-card" />
          </span>
        )}
        <span className="flex items-start justify-between gap-3">
          <span className="flex min-w-0 items-center gap-4">
            <img
              src={project.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-16 shrink-0 rounded-full object-cover ring-1 ring-border transition duration-500 group-hover:scale-105 group-hover:ring-accent/70 group-hover:shadow-[0_0_22px_-8px_var(--accent)]"
            />
            <span className="min-w-0">
              <span className="font-display block text-xl leading-tight font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1">
                {project.title}
              </span>
              {domain && (
                <span className="mt-0.5 block truncate font-mono text-[11px] text-muted-foreground/80">
                  {domain}
                </span>
              )}
            </span>
          </span>
          <span className="relative mt-0.5 h-5 w-5 shrink-0" aria-hidden="true">
            <span className="absolute inset-0 flex items-center justify-end font-mono text-[11px] tabular-nums text-muted-foreground transition-opacity duration-300 group-hover:opacity-0">
              {String(index + 1).padStart(2, '0')}
            </span>
            <ArrowUpRight className="absolute inset-0 size-5 text-muted-foreground opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground group-hover:opacity-100" />
          </span>
        </span>

        <span className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </span>

        <span className="mt-auto pt-5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground/80 uppercase">
          {project.tags.join(' \u00b7 ')}
        </span>
      </motion.a>
    </div>
  )
}

/**
 * Act 1 closer: the projects as a horizontal film strip.
 * Vertical scroll drives the pan on desktop; on small screens
 * or under reduced motion it falls back to a vertical stack.
 */
export function WorkGallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const deckHeaderRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  // Deck cards stick just below the sticky header; derived from its
  // real rendered height so font/device differences can never make a
  // card stick underneath it.
  const [deckTop, setDeckTop] = useState(256)
  const reduced = useReducedMotion()

  const enabled = isDesktop && !reduced

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const measure = () => {
      setIsDesktop(media.matches)
      const track = trackRef.current
      if (track) setDistance(Math.max(track.scrollWidth - window.innerWidth, 0))
      const headerH = deckHeaderRef.current?.offsetHeight
      if (headerH) setDeckTop(headerH + 16)
    }

    measure()
    document.fonts?.ready.then(measure).catch(() => {})
    media.addEventListener('change', measure)
    window.addEventListener('resize', measure)
    return () => {
      media.removeEventListener('change', measure)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])

  // Deck mode (below lg): one progress value across the whole card
  // column; each card maps its own shrink window onto it.
  const { scrollYProgress: deckProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative"
      style={enabled ? { height: `calc(100dvh + ${distance}px)` } : undefined}
    >
      <div className={enabled ? 'sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden' : ''}>
        <div
          ref={deckHeaderRef}
          className="relative max-lg:sticky max-lg:top-0 max-lg:z-10 max-lg:bg-background max-lg:pt-20"
        >
          <div className="flex items-end justify-between px-6 pb-8 md:px-8">
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl" style={{ fontStretch: '108%' }}>
              <AnimatedHeading text="Selected Work" />
            </h2>
            <p className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
              {projects.length} projects
            </p>
          </div>
          {/* Mobile-only intro; desktop keeps the strip's lead-in column */}
          <p className="px-6 pb-5 text-base leading-snug font-medium tracking-tight text-muted-foreground lg:hidden">
            A decade of shipped websites, tools &amp; experiments for clients across four
            countries.
          </p>
          {/* Cards dissolve into the header instead of hitting a hard edge */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-full hidden h-16 bg-gradient-to-b from-background to-transparent max-lg:block"
          />
        </div>

        <motion.div
          ref={trackRef}
          style={enabled ? { x } : undefined}
          className="flex flex-col gap-5 px-6 pb-16 md:px-8 lg:flex-row lg:items-stretch lg:gap-6 lg:pb-0"
        >
          <div className="hidden w-full shrink-0 flex-col justify-center lg:flex lg:w-[320px]">
            <p className="max-w-[26ch] text-lg leading-snug font-medium tracking-tight text-muted-foreground">
              A decade of shipped websites, tools &amp; experiments for clients across four
              countries.
            </p>
          </div>

          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              deckTop={deckTop}
              deck={enabled || reduced ? undefined : { progress: deckProgress, count: projects.length }}
            />
          ))}

          {/* Real element (not padding) so the pan distance counts the
              end gap - scrollWidth ignores trailing padding. */}
          <span aria-hidden="true" className="hidden w-2 shrink-0 lg:block" />
        </motion.div>

        {enabled && (
          <div className="mx-6 mt-10 h-px bg-border md:mx-8">
            <motion.div className="h-px origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
          </div>
        )}
      </div>
    </section>
  )
}
