import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>
  range: [number, number]
  children: string
}) {
  const opacity = useTransform(progress, range, [0.12, 1])
  return (
    <motion.span style={{ opacity }} className="mr-[0.26em] inline-block">
      {children}
    </motion.span>
  )
}

/**
 * Statement text whose words ink-in one by one as the section
 * scrolls through the viewport.
 */
export function TextScrub({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.45'],
  })

  const words = text.split(' ')

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) =>
        reduced ? (
          <span key={i} className="mr-[0.26em] inline-block">
            {word}
          </span>
        ) : (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {word}
          </Word>
        ),
      )}
    </p>
  )
}
