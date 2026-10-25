import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'
import { skills } from '@/data/site'

function SkillList({
  hidden = false,
  ref,
}: {
  hidden?: boolean
  ref?: React.Ref<HTMLUListElement>
}) {
  return (
    // pr-4 mirrors the internal chip gap so the loop seam is invisible
    <ul ref={ref} className="skills flex shrink-0 items-center gap-4 pr-4" aria-hidden={hidden || undefined}>
      {skills.map((skill) => (
        <li
          key={skill.name}
          className="flex items-center gap-2.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-300 hover:border-foreground/40"
        >
          <img src={skill.icon} alt="" width={20} height={20} loading="lazy" className="size-5 object-contain" />
          {skill.name}
        </li>
      ))}
    </ul>
  )
}

/**
 * One marquee per page: the toolkit, skimming past in a single row.
 * The whole strip leans with your scroll speed and settles back.
 * The loop starts only after fonts and icons have loaded, so the
 * track width can never change mid-cycle (which would snap the seam).
 */
export function SkillsMarquee() {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [copies, setCopies] = useState(2)
  const firstListRef = useRef<HTMLUListElement>(null)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(velocity, { damping: 60, stiffness: 320 })
  const skewX = useTransform(smoothVelocity, [-1600, 1600], [-5, 5])

  // Enough copies that the track always covers the viewport plus one
  // full period - otherwise the tail of each cycle runs empty and the
  // reset visibly pops a group in.
  useEffect(() => {
    const measure = () => {
      const period = firstListRef.current?.getBoundingClientRect().width
      if (period && period > 0) {
        setCopies(Math.max(2, Math.ceil((window.innerWidth + period) / period)))
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    let alive = true
    const timeout = setTimeout(() => alive && setReady(true), 2500)

    const icons = [...document.querySelectorAll<HTMLImageElement>('.marquee img')].map(
      (img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.addEventListener('load', () => resolve(), { once: true })
              img.addEventListener('error', () => resolve(), { once: true })
            }),
    )

    Promise.all([document.fonts?.ready ?? Promise.resolve(), ...icons]).then(() => {
      if (alive) setReady(true)
    })

    return () => {
      alive = false
      clearTimeout(timeout)
    }
  }, [])

  const track = (
    <div className="marquee-track flex w-max">
      {Array.from({ length: copies }).map((_, i) => (
        <SkillList key={i} ref={i === 0 ? firstListRef : undefined} hidden={i > 0} />
      ))}
    </div>
  )

  return (
    <section
      aria-label="Skills"
      className={cn('marquee overflow-hidden border-y border-border py-6', ready && 'run')}
      style={{ '--marquee-shift': `${-100 / copies}%` } as CSSProperties}
    >
      {reduced ? (
        track
      ) : (
        <motion.div style={{ skewX }} className="will-change-transform">
          {track}
        </motion.div>
      )}
    </section>
  )
}
