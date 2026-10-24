import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { projects, type Project } from '@/data/projects'

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
        e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
      }}
      className="spotlight-card group relative flex w-full shrink-0 flex-col rounded-2xl border border-border bg-card p-6 transition-transform duration-500 hover:-translate-y-1.5 sm:w-[400px]"
    >
      <span className="flex items-start justify-between gap-3">
        <span className="flex min-w-0 items-center gap-4">
          <img
            src={project.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-16 shrink-0 rounded-full object-cover ring-1 ring-border transition-transform duration-700 group-hover:scale-105"
          />
          <span className="font-display text-xl leading-tight font-semibold tracking-tight">
            {project.title}
          </span>
        </span>
        <ArrowUpRight
          className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>

      <span className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </span>

      <span className="mt-auto flex flex-wrap gap-1.5 pt-5">
        {project.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-[10px] tracking-[0.14em] uppercase">
            {tag}
          </Badge>
        ))}
      </span>
    </a>
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
            Selected Work
          </h2>
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
            {projects.length} projects
          </p>
        </div>

        <motion.div
          ref={trackRef}
          style={enabled ? { x } : undefined}
          className="flex flex-col gap-5 px-6 pb-16 md:px-8 lg:flex-row lg:items-stretch lg:gap-6 lg:pb-0 lg:pr-16"
        >
          <div className="flex w-full shrink-0 flex-col justify-center lg:w-[320px]">
            <p className="max-w-[26ch] text-lg leading-snug font-medium tracking-tight text-muted-foreground">
              A decade of shipped websites, tools &amp; experiments for clients across four
              countries.
            </p>
          </div>

          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
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
