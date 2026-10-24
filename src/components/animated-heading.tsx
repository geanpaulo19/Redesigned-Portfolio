import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

const letterVariants = {
  hidden: { y: '112%' },
  show: (i: number) => ({
    y: '0%',
    transition: { duration: 0.9, ease: EASE, delay: i * 0.035 },
  }),
}

/**
 * Section heading whose letters rise into place as it enters the
 * viewport, matching the hero's entrance choreography. The clipped
 * wrapper is what observes; the letters inherit the trigger, since
 * IntersectionObserver never fires for fully clipped elements.
 */
export function AnimatedHeading({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <span className={className}>{text}</span>
  }

  return (
    <motion.span
      aria-label={text}
      className={cn('inline-flex overflow-hidden py-[0.06em] -my-[0.06em]', className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex whitespace-pre">
        {text.split('').map((ch, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            className="inline-block will-change-transform"
          >
            {ch}
          </motion.span>
        ))}
      </span>
    </motion.span>
  )
}
