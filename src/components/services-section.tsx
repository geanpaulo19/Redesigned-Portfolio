import { AnimatedHeading } from '@/components/animated-heading'
import { useReveal } from '@/hooks/use-reveal'
import { cn } from '@/lib/utils'
import { services } from '@/data/site'

function ServiceCell({
  icon,
  title,
  description,
  delay,
  index,
}: {
  icon: string
  title: string
  description: string
  delay: number
  index: string
}) {
  const { ref, visible } = useReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn('border-t border-border pt-6', visible ? 'animate-fade-rise' : 'opacity-0')}
      style={visible ? { animationDelay: `${delay}s` } : undefined}
    >
      {/* The hover surface is a padded card that materializes over the
          hairline grid; negative margins keep the resting alignment. */}
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
          e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
        }}
        className="spotlight-card group relative -m-5 rounded-xl p-5 transition-colors duration-300 hover:bg-card/60"
      >
        <div className="flex items-start justify-between">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <i className={`ph ph-${icon} text-[1.15rem] text-background`} aria-hidden="true" />
          </span>
          <span
            className="font-mono text-[11px] tabular-nums text-muted-foreground"
            aria-hidden="true"
          >
            {index}
          </span>
        </div>
        <h3
          className="font-display mt-5 text-2xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1"
          style={{ fontStretch: '106%' }}
        >
          {title}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function ServicesSection() {
  const heading = useReveal<HTMLDivElement>()

  return (
    <section id="services" aria-label="Services" className="mx-auto w-full max-w-7xl px-6 pt-20 pb-24 md:px-8 md:pt-28 md:pb-32">
      <div ref={heading.ref} className={cn(heading.visible ? 'animate-fade-rise' : 'opacity-0')}>
        <h2
          className="font-display text-5xl font-bold tracking-tight sm:text-6xl"
          style={{ fontStretch: '108%' }}
        >
          <AnimatedHeading text="What I do" />
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Six ways I can help, from first sketch to final deploy.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <ServiceCell
            key={service.title}
            icon={service.icon}
            title={service.title}
            description={service.description}
            delay={(i % 3) * 0.12}
            index={String(i + 1).padStart(2, '0')}
          />
        ))}
      </div>

      <div
        className={cn(
          'mt-14 flex justify-center',
          heading.visible ? 'animate-fade-rise' : 'opacity-0',
        )}
        style={heading.visible ? { animationDelay: '0.5s' } : undefined}
      >
        <a
          href="#reach"
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
        >
          Not sure which one fits? Tell me the idea
          <i
            className="ph ph-arrow-right text-accent transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </a>
      </div>
    </section>
  )
}
