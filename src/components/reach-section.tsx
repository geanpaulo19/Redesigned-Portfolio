import { Check, Copy } from 'lucide-react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'

import { AnimatedHeading } from '@/components/animated-heading'
import { Button } from '@/components/ui/button'
import { useManilaTime } from '@/hooks/use-manila-time'
import { useManilaWeather, weatherIcon, weatherText } from '@/hooks/use-manila-weather'
import { useVisitorTime } from '@/hooks/use-visitor-time'
import { useReveal } from '@/hooks/use-reveal'
import { cn } from '@/lib/utils'
import { availability, contact } from '@/data/site'

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
  const weather = useManilaWeather()
  const visitor = useVisitorTime()
  const { ref, visible } = useReveal<HTMLDivElement>()
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(copiedTimer.current), [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
    } catch {
      // Older webviews: fall back to the legacy copy path
      const helper = document.createElement('textarea')
      helper.value = contact.email
      helper.style.position = 'fixed'
      helper.style.opacity = '0'
      document.body.appendChild(helper)
      helper.select()
      document.execCommand('copy')
      helper.remove()
    }
    setCopied(true)
    window.clearTimeout(copiedTimer.current)
    copiedTimer.current = window.setTimeout(() => setCopied(false), 2000)
  }

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
          <AnimatedHeading text="Like what you see?" />
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Let&rsquo;s build something amazing together.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-3">
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
          <Button
            variant="outline"
            onClick={copyEmail}
            className="rounded-full px-9 py-4 text-base transition-transform duration-300 hover:scale-[1.03]"
          >
            {copied ? <Check /> : <Copy />}
            {copied ? 'Copied' : 'Copy email'}
          </Button>
        </div>

        <p className="mt-12 flex flex-wrap items-center gap-2.5 font-mono text-xs text-muted-foreground">
          <span
            className="inline-block size-2 rounded-full"
            style={{
              background: availability.open ? 'var(--accent)' : 'var(--muted-foreground)',
            }}
            aria-hidden="true"
          />
          {availability.open ? availability.available : availability.booked}
          <span className="opacity-40">|</span>
          <span className="tabular-nums text-foreground">{time}</span> MNL
          {weather && (
            <>
              <span className="opacity-40">|</span>
              <i className={`ph ph-${weatherIcon(weather.code)} text-accent`} aria-hidden="true" />
              <span className="tabular-nums text-foreground">{weather.temp}&deg;C</span>
              {weatherText(weather.code)} in Manila
            </>
          )}
        </p>

        {visitor && (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            It&rsquo;s {visitor.time} where you are
            {visitor.dayDiff === 1 && '. That\u2019s already tomorrow for me'}
            {visitor.dayDiff === -1 && '. That\u2019s still yesterday for me'}.
          </p>
        )}
      </div>
    </section>
  )
}
