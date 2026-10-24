import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useRef, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { useManilaTime } from '@/hooks/use-manila-time'
import { useReveal } from '@/hooks/use-reveal'
import { cn } from '@/lib/utils'
import { contact } from '@/data/site'

/** Wraps children with a spring-tracked pull toward the cursor. */
function Magnetic({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 160, damping: 14, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 160, damping: 14, mass: 0.4 })

  if (reduced) return <>{children}</>

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      className="inline-block"
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((e.clientX - (rect.left + rect.width / 2)) * 0.28)
        y.set((e.clientY - (rect.top + rect.height / 2)) * 0.28)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

export function ReachSection() {
  const time = useManilaTime()
  const { ref, visible } = useReveal<HTMLDivElement>()

  return (
    <section id="reach" className="border-t border-border">
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full max-w-7xl px-6 py-24 md:px-8 md:py-40',
          visible ? 'animate-fade-rise' : 'opacity-0',
        )}
      >
        <h2
          className="font-display text-5xl font-bold tracking-tight sm:text-7xl"
          style={{ fontStretch: '108%' }}
        >
          Like what you see?
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Let&rsquo;s build something amazing together.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Magnetic>
            <Button asChild className="rounded-full px-9 py-4 text-base">
              <a href={`mailto:${contact.email}`}>Get in Touch</a>
            </Button>
          </Magnetic>
          <Button
            asChild
            variant="outline"
            className="rounded-full px-9 py-4 text-base transition-transform duration-300 hover:scale-[1.03]"
          >
            <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </Button>
        </div>

        <p className="mt-12 flex items-center gap-2.5 font-mono text-xs text-muted-foreground">
          <span
            className="inline-block size-2 rounded-full"
            style={{ background: 'var(--accent)' }}
            aria-hidden="true"
          />
          Available for projects
          <span className="opacity-40">|</span>
          <span className="tabular-nums text-foreground">{time}</span> MNL
        </p>
      </div>
    </section>
  )
}
