import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

import { useReveal } from '@/hooks/use-reveal'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

interface Quote {
  text: string
  author: string
}

export function JournalSection() {
  const [quote, setQuote] = useState<Quote>({ text: 'Stay motivated!', author: '' })
  const [loaded, setLoaded] = useState(false)
  const { ref, visible } = useReveal<HTMLDivElement>()
  const reduced = useReducedMotion()

  useEffect(() => {
    let cancelled = false

    fetch('https://zenquotes.geanpaulofrancois.workers.dev/')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        setQuote({ text: data.text || 'Stay motivated!', author: data.author || '' })
        setLoaded(true)
      })
      .catch(() => {
        if (cancelled) return
        setLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const words = quote.text.split(' ')
  const glyphDelay = 0.1
  const wordDelay = 0.45
  const stagger = 0.035
  const authorDelay = wordDelay + words.length * stagger + 0.15

  return (
    <section id="journal" className="border-t border-border">
      <div
        ref={ref}
        className={cn(
          'mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-24 text-center md:py-32',
          visible ? 'animate-fade-rise' : 'opacity-0',
        )}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Quote for the day
        </p>

        {/* Oversized lime opening mark */}
        <motion.span
          aria-hidden="true"
          initial={reduced ? false : { opacity: 0, y: 16, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: glyphDelay }}
          className="font-display mt-8 block text-[4rem] leading-[0.4] text-accent select-none"
          style={{ fontStretch: '108%' }}
        >
          &ldquo;
        </motion.span>

        {loaded && (
          <blockquote
            className="font-display mt-5 text-3xl leading-tight font-medium tracking-tight text-balance italic sm:text-4xl md:text-[2.75rem]"
            style={{ fontStretch: '104%' }}
          >
            <span className="sr-only">{quote.text}</span>
            <span aria-hidden="true">
              {reduced ? (
                words.map((word, i) => (
                  <span key={i} className="mr-[0.26em] inline-block">
                    {word}
                  </span>
                ))
              ) : (
                /* Keyed by the quote so the entrance replays cleanly
                   whenever the text changes; the container observes
                   and the clipped words inherit the trigger. */
                <motion.span
                  key={quote.text}
                  className="inline"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {words.map((word, i) => (
                    <span
                      key={i}
                      className="mr-[0.14em] inline-block overflow-hidden pr-[0.12em] pb-[0.28em] -mb-[0.28em] align-bottom"
                    >
                      <motion.span
                        className="inline-block will-change-transform"
                        custom={i}
                        variants={{
                          hidden: { y: '112%' },
                          show: (i: number) => ({
                            y: '0%',
                            transition: {
                              duration: 0.7,
                              ease: EASE,
                              delay: wordDelay + i * stagger,
                            },
                          }),
                        }}
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
                </motion.span>
              )}
            </span>
          </blockquote>
        )}

        {loaded && quote.author && (
          <motion.cite
            initial={reduced ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.6, ease: EASE, delay: authorDelay }}
            className="mt-7 flex items-center gap-2.5 font-mono text-xs text-muted-foreground not-italic"
          >
            <span className="inline-block size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {quote.author}
          </motion.cite>
        )}

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: loaded ? authorDelay + 0.3 : 0.8 }}
          className="mt-12 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70"
        >
          New quote every day
        </motion.p>
      </div>
    </section>
  )
}
