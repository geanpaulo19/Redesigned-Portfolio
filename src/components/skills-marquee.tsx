import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'

import { skills } from '@/data/site'

function SkillList({ hidden = false }: { hidden?: boolean }) {
  return (
    // pr-4 mirrors the internal chip gap so the loop seam is invisible
    <ul className="skills flex shrink-0 items-center gap-4 pr-4" aria-hidden={hidden || undefined}>
      {skills.map((skill) => (
        <li
          key={skill.name}
          className="flex items-center gap-2.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium whitespace-nowrap"
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
 */
export function SkillsMarquee() {
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(velocity, { damping: 60, stiffness: 320 })
  const skewX = useTransform(smoothVelocity, [-1600, 1600], [-5, 5])

  const track = (
    <div className="marquee-track flex w-max">
      <SkillList />
      <SkillList hidden />
    </div>
  )

  return (
    <section aria-label="Skills" className="marquee overflow-hidden border-y border-border py-6">
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
