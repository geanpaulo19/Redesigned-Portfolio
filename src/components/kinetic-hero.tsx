import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'

import { useManilaTime } from '@/hooks/use-manila-time'
import { availability } from '@/data/site'

const EASE = [0.16, 1, 0.3, 1] as const

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4'

/* Base variable-font axes for the name; letters bulge toward these near the cursor */
const BASE_VF = '"wght" 800, "wdth" 112'

/**
 * Fullscreen looping background video. React's muted prop is
 * unreliable for autoplay in some browsers, so the property is
 * forced before play() as a fallback. The clip pushes in slowly
 * as the hero scrolls away. Data savers get the poster still
 * instead of the video download; everyone else sees the poster
 * the instant autoplay is blocked.
 */
function HeroVideo({ scrollScale }: { scrollScale?: MotionValue<number> }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [lowData] = useState(() => {
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string }
      }
    ).connection
    return !!conn?.saveData || ['slow-2g', '2g'].includes(conn?.effectiveType ?? '')
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true

    if (reduced) {
      video.pause()
      return
    }

    video.play().catch(() => {
      /* autoplay blocked; the poster frame remains */
    })
  }, [reduced])

  return (
    <>
      {lowData ? (
        <motion.div
          style={scrollScale && !reduced ? { scale: scrollScale } : undefined}
          className="absolute inset-0 z-0 bg-cover bg-center bg-[url(/assets/images/hero-poster.jpg)] will-change-transform"
          aria-hidden="true"
        />
      ) : (
        <motion.video
          ref={videoRef}
          style={scrollScale && !reduced ? { scale: scrollScale } : undefined}
          className="absolute inset-0 z-0 h-full w-full object-cover will-change-transform"
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/images/hero-poster.jpg"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </motion.video>
      )}
      <div className="hero-scrim absolute inset-0 z-[1]" aria-hidden="true" />
    </>
  )
}

/**
 * One line of the name: letters rise out of a clipped row,
 * distributed edge-to-edge across the viewport. GEAN carries a bolt
 * badge as its fifth element - a lime coin with a tooltip that
 * explains the mark on hover or tap.
 */
function NameLine({
  word,
  delay,
  drift,
  reduced,
  sparkle = false,
}: {
  word: string
  delay: number
  drift?: MotionValue<string>
  reduced: boolean | null
  sparkle?: boolean
}) {
  const [tipOpen, setTipOpen] = useState(false)
  const [settled, setSettled] = useState(reduced === true)
  const tipId = 'name-badge-tip'

  // The row clips the letters during their entrance; once they have
  // settled, the clip is released so the badge tooltip can escape.
  useEffect(() => {
    if (reduced) return
    const t = setTimeout(() => setSettled(true), 1800)
    return () => clearTimeout(t)
  }, [reduced])

  return (
    <motion.div
      style={{ x: drift }}
      className={`py-[0.05em] ${settled ? 'overflow-visible' : 'overflow-hidden'}`}
    >
      <div className="flex w-full items-baseline justify-between px-1">
        {word.split('').map((ch, i) =>
          reduced ? (
            <span key={i}>{ch}</span>
          ) : (
            <motion.span
              key={i}
              data-letter
              className="letter-settle inline-block will-change-transform"
              style={{
                fontVariationSettings: BASE_VF,
                animationDelay: `${delay + i * 0.05}s`,
              }}
              initial={{ y: '112%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: EASE, delay: delay + i * 0.05 }}
            >
              {ch}
            </motion.span>
          ),
        )}
        {sparkle && (
          <span className="relative inline-flex self-baseline -translate-y-[0.185em]">
            {reduced ? (
              <span
                className="flex size-[0.6em] items-center justify-center rounded-full bg-accent"
                aria-hidden="true"
              >
                <i
                  className="ph-fill ph-lightning text-[0.38em] text-background"
                  aria-hidden="true"
                />
              </span>
            ) : (
              <motion.button
                type="button"
                initial={{ y: '112%' }}
                animate={{ y: '0%' }}
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 1, ease: EASE, delay: delay + word.length * 0.05 }}
                className="flex size-[0.6em] cursor-pointer items-center justify-center rounded-full bg-accent"
                aria-label="About the bolt mark"
                aria-describedby={tipOpen ? tipId : undefined}
                onMouseEnter={() => setTipOpen(true)}
                onMouseLeave={() => setTipOpen(false)}
                onFocus={() => setTipOpen(true)}
                onBlur={() => setTipOpen(false)}
                onClick={() => setTipOpen((v) => !v)}
              >
                <i
                  className="ph-fill ph-lightning text-[0.38em] text-background"
                  aria-hidden="true"
                />
              </motion.button>
            )}
            {tipOpen && (
              <span
                role="tooltip"
                id={tipId}
                className="absolute bottom-[calc(100%+14px)] right-0 z-30 block w-60 rounded-xl border border-border bg-card p-3.5 text-left font-body text-sm font-normal leading-relaxed tracking-normal text-muted-foreground normal-case shadow-[0_18px_44px_-14px_rgba(0,0,0,0.65)]"
              >
                The bolt stands for momentum: the energy we bring to every build.
              </span>
            )}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export function KineticHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const time = useManilaTime()
  const reduced = useReducedMotion()
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const finePointer = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )
  const pointer = useRef({ x: 0, y: 0 })
  const frame = useRef(0)

  // Leaving the hero flies you through the name: the lines drift
  // apart and the lockup scales past the camera while fading.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const driftA = useTransform(scrollYProgress, [0, 1], ['0%', '-16%'])
  const driftB = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 4.2])
  const nameOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const rowOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])

  // Letters swell in weight and width as the cursor nears them.
  useEffect(() => {
    return () => cancelAnimationFrame(frame.current)
  }, [])

  const updateLetters = () => {
    const { x, y } = pointer.current
    sectionRef.current
      ?.querySelectorAll<HTMLElement>('[data-letter]')
      .forEach((el) => {
        const r = el.getBoundingClientRect()
        const dx = x - (r.left + r.width / 2)
        const dy = y - (r.top + r.height / 2)
        const f = Math.max(0, 1 - Math.hypot(dx, dy) / 340)
        const wght = Math.round(800 + f * 100)
        const wdth = (112 + f * 13).toFixed(1)
        el.style.fontVariationSettings = `"wght" ${wght}, "wdth" ${wdth}`
      })
  }

  const onLetterMove = (e: ReactMouseEvent<HTMLElement>) => {
    if (reduced || !finePointer.current) return
    pointer.current = { x: e.clientX, y: e.clientY }
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(updateLetters)
  }

  const onLetterLeave = () => {
    cancelAnimationFrame(frame.current)
    sectionRef.current
      ?.querySelectorAll<HTMLElement>('[data-letter]')
      .forEach((el) => {
        el.style.fontVariationSettings = BASE_VF
      })
  }

  return (
    <section
      ref={sectionRef}
      id="home"
      onMouseMove={onLetterMove}
      onMouseLeave={onLetterLeave}
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden px-4 pt-24 pb-10 sm:px-6 md:px-8"
    >
      <HeroVideo scrollScale={videoScale} />

      <motion.p
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
        className="relative z-10 mb-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/70"
      >
        <i className="ph ph-hand-waving hand-wave text-accent" aria-hidden="true" />
        {greeting}, I&rsquo;m
      </motion.p>

      <motion.h1
        aria-label="Gean Paulo"
        style={reduced ? undefined : { scale, opacity: nameOpacity }}
        className="font-display relative z-10 w-full leading-[0.82] font-extrabold tracking-[-0.03em] text-white select-none will-change-transform"
      >
        <span className="sr-only">Gean Paulo</span>
        <span aria-hidden="true" className="block text-[clamp(4.5rem,17.5vw,17rem)]" style={{ fontStretch: '112%' }}>
          <NameLine word="GEAN" sparkle delay={0.15} drift={reduced ? undefined : driftA} reduced={reduced} />
          <NameLine word="PAULO" delay={0.4} drift={reduced ? undefined : driftB} reduced={reduced} />
        </span>
      </motion.h1>

      <motion.div style={reduced ? undefined : { opacity: rowOpacity }} className="relative z-10">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
          className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-6 md:mt-14 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-md text-lg leading-snug font-medium tracking-tight text-white">
            Web designer &amp; front-end developer crafting interactive, user-friendly digital
            experiences.
          </p>

        <p className="flex items-center gap-2.5 font-mono text-xs text-white/70">
          <span className="relative inline-flex size-2" aria-hidden="true">
            <span
              className="absolute inline-flex size-full animate-ping rounded-full"
              style={{
                background: availability.open
                  ? 'color-mix(in srgb, var(--accent) 60%, transparent)'
                  : 'color-mix(in srgb, var(--muted-foreground) 60%, transparent)',
              }}
            />
            <span
              className="relative inline-flex size-2 rounded-full"
              style={{
                background: availability.open ? 'var(--accent)' : 'var(--muted-foreground)',
              }}
            />
          </span>
          {availability.open ? availability.available : availability.booked}
          <span className="opacity-40">|</span>
          <span className="tabular-nums text-white">{time}</span> MNL
        </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
