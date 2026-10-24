import { AnimatedHeading } from '@/components/animated-heading'
import { useReveal } from '@/hooks/use-reveal'
import { cn } from '@/lib/utils'
import { services } from '@/data/site'

function ServiceCell({
  icon,
  title,
  description,
  delay,
}: {
  icon: string
  title: string
  description: string
  delay: number
}) {
  const { ref, visible } = useReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn('border-t border-border pt-6', visible ? 'animate-fade-rise' : 'opacity-0')}
      style={visible ? { animationDelay: `${delay}s` } : undefined}
    >
      <i className={`ph ph-${icon} text-[1.6rem] text-accent`} aria-hidden="true" />
      <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight" style={{ fontStretch: '106%' }}>
        {title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

export function ServicesSection() {
  const heading = useReveal<HTMLDivElement>()

  return (
    <section id="services" aria-label="Services" className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-8 md:pb-32">
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
          />
        ))}
      </div>
    </section>
  )
}
