import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useRef, useState } from 'react'

import { cn } from '@/lib/utils'

export type ScrubSegment =
  | string
  | { icon: string }
  | { word: string; icon: string; description: string }

type Token =
  | { kind: 'word'; text: string }
  | { kind: 'icon'; icon: string }
  | { kind: 'pill'; word: string; icon: string; description: string }

function WordToken({
  progress,
  range,
  text,
}: {
  progress: MotionValue<number>
  range: [number, number]
  text: string
}) {
  const opacity = useTransform(progress, range, [0.12, 1])
  return (
    <motion.span style={{ opacity }} className="mr-[0.26em] inline-block">
      {text}
    </motion.span>
  )
}

function IconToken({
  progress,
  range,
  icon,
  index,
}: {
  progress: MotionValue<number>
  range: [number, number]
  icon: string
  index: number
}) {
  const opacity = useTransform(progress, range, [0.12, 1])
  return (
    <motion.span style={{ opacity }} className="mr-[0.26em] inline-block">
      <i
        className={`ph ph-${icon} inline-graphic text-[0.72em]`}
        style={{ animationDelay: `${-(index % 5) * 0.7}s` }}
        aria-hidden="true"
      />
    </motion.span>
  )
}

function PillToken({
  progress,
  range,
  token,
  index,
  align,
}: {
  progress: MotionValue<number>
  range: [number, number]
  token: { word: string; icon: string; description: string }
  index: number
  align: 'center' | 'right'
}) {
  const opacity = useTransform(progress, range, [0.12, 1])
  const [open, setOpen] = useState(false)
  const tipId = `statement-tip-${index}`

  return (
    <span className="relative mr-[0.26em] inline-block">
      <motion.button
        type="button"
        style={{ opacity }}
        aria-describedby={open ? tipId : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex cursor-pointer items-center gap-[0.18em] rounded-full border border-border bg-foreground/[0.04] px-[0.3em] py-[0.02em] align-baseline transition-colors duration-300 hover:border-foreground/40"
      >
        {token.word}
        <i
          className={`ph ph-${token.icon} inline-graphic text-[0.72em]`}
          aria-hidden="true"
        />
      </motion.button>
      {open && (
        <span
          role="tooltip"
          id={tipId}
          className={cn(
            'absolute bottom-[calc(100%+0.45em)] left-0 z-30 block w-56 max-w-[calc(100vw-3rem)] rounded-xl border border-border bg-card p-3.5 text-left font-body text-sm font-normal leading-relaxed tracking-normal text-muted-foreground normal-case shadow-[0_18px_44px_-14px_rgba(0,0,0,0.65)] sm:left-1/2 sm:-translate-x-1/2',
            align === 'right' && 'sm:left-auto sm:right-0 sm:translate-x-0',
          )}
        >
          {token.description}
        </span>
      )}
    </span>
  )
}

/**
 * Statement text whose words ink-in one by one as the section
 * scrolls through the viewport. Segments may be plain strings
 * (split into words), { icon } tokens that render as small inline
 * graphics, or { word, icon, description } tokens that render as
 * interactive pills revealing a description on hover or tap.
 */
export function TextScrub({
  segments,
  className,
}: {
  segments: ScrubSegment[]
  className?: string
}) {
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
    } else if ('word' in segment) {
      tokens.push({ kind: 'pill', ...segment })
    } else {
      tokens.push({ kind: 'icon', icon: segment.icon })
    }
  })

  return (
    <p ref={ref} className={className}>
      {tokens.map((token, i) => {
        const range: [number, number] = [i / tokens.length, (i + 1) / tokens.length]

        if (reduced) {
          if (token.kind === 'icon') {
            return (
              <i
                key={i}
                className={`ph ph-${token.icon} inline-graphic text-[0.72em] mr-[0.26em] inline-block`}
                aria-hidden="true"
              />
            )
          }
          if (token.kind === 'pill') {
            return (
              <span key={i} className="relative mr-[0.26em] inline-block">
                <span className="inline-flex items-center gap-[0.18em] rounded-full border border-border bg-foreground/[0.04] px-[0.3em] py-[0.02em]">
                  {token.word}
                  <i className={`ph ph-${token.icon} inline-graphic text-[0.72em]`} aria-hidden="true" />
                </span>
              </span>
            )
          }
          return (
            <span key={i} className="mr-[0.26em] inline-block">
              {token.text}
            </span>
          )
        }

        if (token.kind === 'icon') {
          return <IconToken key={i} progress={scrollYProgress} range={range} icon={token.icon} index={i} />
        }
        if (token.kind === 'pill') {
          return (
            <PillToken
              key={i}
              progress={scrollYProgress}
              range={range}
              token={token}
              index={i}
              align={i === tokens.length - 2 ? 'right' : 'center'}
            />
          )
        }
        return <WordToken key={i} progress={scrollYProgress} range={range} text={token.text} />
      })}
    </p>
  )
}
