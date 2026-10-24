import { useEffect, useState } from 'react'

import { useReveal } from '@/hooks/use-reveal'
import { cn } from '@/lib/utils'

interface Quote {
  text: string
  author: string
}

export function JournalSection() {
  const [quote, setQuote] = useState<Quote>({ text: 'Stay motivated!', author: '' })
  const { ref, visible } = useReveal<HTMLDivElement>()

  useEffect(() => {
    let cancelled = false

    fetch('https://proxy.geanpaulofrancois.workers.dev/')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        setQuote({ text: data.text || 'Stay motivated!', author: data.author || '' })
      })
      .catch(() => {
        /* keep the fallback quote */
      })

    return () => {
      cancelled = true
    }
  }, [])

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
        <blockquote
          className="mt-7 text-3xl leading-tight font-medium tracking-tight text-balance italic sm:text-4xl md:text-5xl"
          style={{ fontStretch: '104%' }}
        >
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        {quote.author && (
          <cite className="mt-6 font-mono text-xs text-muted-foreground not-italic">
            - {quote.author}
          </cite>
        )}
      </div>
    </section>
  )
}
