import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'

import { AnimatedHeading } from '@/components/animated-heading'
import { useReveal } from '@/hooks/use-reveal'
import { cn } from '@/lib/utils'
import { about } from '@/data/site'

interface DetailBlock {
  label: string
  lines: string[]
}

const details: DetailBlock[] = [
  { label: 'Education', lines: [about.education] },
  { label: 'Experience', lines: about.experience },
  { label: 'Journey', lines: about.journey },
]

/** Hobby pill matching the statement's design/build/purpose language. */
function HobbyPill({
  text,
  icon,
  description,
}: {
  text: string
  icon: string
  description: string
}) {
  const [open, setOpen] = useState(false)
  const tipId = `hobby-tip-${text.replace(/\W+/g, '-').toLowerCase()}`

  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-describedby={open ? tipId : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-4 py-2 text-sm text-foreground/90 transition-colors duration-300 hover:border-foreground/40"
      >
        {text}
        <i className={`ph ph-${icon} inline-graphic text-[1.05em]`} aria-hidden="true" />
      </button>
      {open && (
        <span
          role="tooltip"
          id={tipId}
          className="absolute bottom-[calc(100%+8px)] left-0 z-30 block w-52 max-w-[calc(100vw-3rem)] rounded-xl border border-border bg-card p-3 text-left font-body text-sm leading-relaxed text-muted-foreground normal-case shadow-[0_18px_44px_-14px_rgba(0,0,0,0.65)]"
        >
          {description}
        </span>
      )}
    </span>
  )
}

export function AboutSection() {
  const heading = useReveal<HTMLDivElement>()
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  // The portrait drifts against the scroll for a little depth.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const portraitY = useTransform(scrollYProgress, [0, 1], [26, -26])

  return (
    <section id="about" ref={sectionRef} className="border-t border-border">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-8 md:py-36">
        <div ref={heading.ref} className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <div
              className={cn(
                'flex items-center gap-5',
                heading.visible ? 'animate-fade-rise' : 'opacity-0',
              )}
            >
              <motion.img
                src="/assets/images/hero.jpg"
                alt="Portrait of Gean Paulo"
                width={96}
                height={96}
                loading="lazy"
                decoding="async"
                style={reduced ? undefined : { y: portraitY }}
                className="size-24 shrink-0 rounded-full object-cover ring-1 ring-border"
              />
              <h2
                className="font-display text-5xl font-bold tracking-tight sm:text-6xl"
                style={{ fontStretch: '108%' }}
              >
                <AnimatedHeading text="About" />
              </h2>
            </div>
            <p
              className={cn(
                'mt-7 leading-relaxed text-muted-foreground',
                heading.visible ? 'animate-fade-rise' : 'opacity-0',
              )}
              style={heading.visible ? { animationDelay: '0.1s' } : undefined}
            >
              {about.bio.map((segment, i) =>
                typeof segment === 'string' ? (
                  <span key={i}>{segment}</span>
                ) : (
                  <i
                    key={i}
                    className={`ph ph-${segment.icon} inline-graphic text-[1.05em]`}
                    style={{ animationDelay: `${-(i % 5) * 0.7}s` }}
                    aria-hidden="true"
                  />
                ),
              )}
            </p>
          </div>

          <div className="md:col-span-7">
            {details.map((block, i) => (
              <div
                key={block.label}
                className={cn(
                  'border-t border-border py-7 first:border-t-0 first:pt-0 md:py-8',
                  heading.visible ? 'animate-fade-rise' : 'opacity-0',
                )}
                style={heading.visible ? { animationDelay: `${0.15 + i * 0.1}s` } : undefined}
              >
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {block.label}
                </h3>
                <div className="mt-3.5 space-y-1.5">
                  {block.lines.map((line) => (
                    <p key={line} className="text-foreground/90">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <div
              className={cn(
                'border-t border-border py-7 md:py-8',
                heading.visible ? 'animate-fade-rise' : 'opacity-0',
              )}
              style={heading.visible ? { animationDelay: '0.45s' } : undefined}
            >
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Beyond the screen
              </h3>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {about.hobbies.map((hobby) => (
                  <HobbyPill key={hobby.text} {...hobby} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
