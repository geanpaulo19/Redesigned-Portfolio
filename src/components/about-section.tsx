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
  { label: 'Beyond the screen', lines: [about.hobbies] },
]

export function AboutSection() {
  const heading = useReveal<HTMLDivElement>()

  return (
    <section id="about" className="mx-auto w-full max-w-7xl px-6 py-24 md:px-8 md:py-36">
      <div ref={heading.ref} className={cn(heading.visible ? 'animate-fade-rise' : 'opacity-0')}>
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-5">
              <img
                src="/assets/images/hero.jpg"
                alt="Portrait of Gean Paulo"
                width={96}
                height={96}
                loading="lazy"
                decoding="async"
                className="size-24 shrink-0 rounded-full object-cover ring-1 ring-border"
              />
              <h2
                className="font-display text-5xl font-bold tracking-tight sm:text-6xl"
                style={{ fontStretch: '108%' }}
              >
                About
              </h2>
            </div>
            <p className="mt-7 leading-relaxed text-muted-foreground">
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
            {details.map((block) => (
              <div
                key={block.label}
                className="border-t border-border py-7 first:border-t-0 first:pt-0 md:py-8"
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
          </div>
        </div>
      </div>
    </section>
  )
}
