import { ArrowUpRight } from 'lucide-react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'

import { AnimatedHeading } from '@/components/animated-heading'
import { cn } from '@/lib/utils'
import { projects, type Project } from '@/data/projects'

function ProjectCard({ project, index }: { project: Project; index: number }) {
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
      className={cn('w-full shrink-0 sm:w-[400px]', revealed ? 'animate-fade-rise' : 'opacity-0')}
      style={revealed ? { animationDelay: `${index * 45}ms` } : undefined}
    >
      <motion.a
        ref={cardRef}
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMove}
        onMouseLeave={resetTilt}
        whileHover={reduced ? undefined : { y: -6 }}
        style={reduced ? undefined : { rotateX: springX, rotateY: springY, transformPerspective: 900 }}
        className="spotlight-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        {project.shot && (
          <span className="relative -mx-6 -mt-6 mb-5 block h-44" aria-hidden="true">
            <img
              src={project.shot}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top"
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
  const [distance, setDistance] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const reduced = useReducedMotion()

  const enabled = isDesktop && !reduced

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const measure = () => {
      setIsDesktop(media.matches)
      const track = trackRef.current
      if (track) setDistance(Math.max(track.scrollWidth - window.innerWidth, 0))
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

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative"
      style={enabled ? { height: `calc(100dvh + ${distance}px)` } : undefined}
    >
      <div className={enabled ? 'sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden' : ''}>
        <div className="flex items-end justify-between px-6 pb-8 md:px-8">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl" style={{ fontStretch: '108%' }}>
            <AnimatedHeading text="Selected Work" />
          </h2>
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
            {projects.length} projects
          </p>
        </div>

        <motion.div
          ref={trackRef}
          style={enabled ? { x } : undefined}
          className="flex flex-col gap-5 px-6 pb-16 md:px-8 lg:flex-row lg:items-stretch lg:gap-6 lg:pb-0"
        >
          <div className="flex w-full shrink-0 flex-col justify-center lg:w-[320px]">
            <p className="max-w-[26ch] text-lg leading-snug font-medium tracking-tight text-muted-foreground">
              A decade of shipped websites, tools &amp; experiments for clients across four
              countries.
            </p>
          </div>

          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
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
