import { motion, useScroll, useSpring } from 'motion/react'

/** Thin reading-progress line pinned to the top edge. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-accent"
      style={{ scaleX }}
    />
  )
}
