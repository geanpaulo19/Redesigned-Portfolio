import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useRef } from 'react'

export type ScrubSegment = string | { icon: string }

type Token = { kind: 'word'; text: string } | { kind: 'icon'; icon: string }

function Token({
  progress,
  range,
  token,
  index,
}: {
  progress: MotionValue<number>
  range: [number, number]
  token: Token
  index: number
}) {
  const opacity = useTransform(progress, range, [0.12, 1])

  if (token.kind === 'icon') {
    return (
      <motion.span style={{ opacity }} className="mr-[0.26em] inline-block">
        <i
          className={`ph ph-${token.icon} inline-graphic`}
          style={{ animationDelay: `${-(index % 5) * 0.7}s` }}
          aria-hidden="true"
        />
      </motion.span>
    )
  }

  return (
    <motion.span style={{ opacity }} className="mr-[0.26em] inline-block">
      {token.text}
    </motion.span>
  )
}

/**
 * Statement text whose words ink-in one by one as the section
 * scrolls through the viewport. Segments may be plain strings
 * (split into words) or { icon } tokens that render as small
 * inline graphics flowing with the sentence.
 */
export function TextScrub({ segments, className }: { segments: ScrubSegment[]; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.45'],
  })

  const tokens: Token[] = []
  segments.forEach((segment) => {
    if (typeof segment === 'string') {
      segment
        .split(' ')
        .filter(Boolean)
        .forEach((text) => tokens.push({ kind: 'word', text }))
    } else {
      tokens.push({ kind: 'icon', icon: segment.icon })
    }
  })

  return (
    <p ref={ref} className={className}>
      {tokens.map((token, i) =>
        reduced ? (
          token.kind === 'icon' ? (
            <i
              key={i}
              className={`ph ph-${token.icon} inline-graphic mr-[0.26em] inline-block`}
              aria-hidden="true"
            />
          ) : (
            <span key={i} className="mr-[0.26em] inline-block">
              {token.text}
            </span>
          )
        ) : (
          <Token
            key={i}
            progress={scrollYProgress}
            range={[i / tokens.length, (i + 1) / tokens.length]}
            token={token}
            index={i}
          />
        ),
      )}
    </p>
  )
}
