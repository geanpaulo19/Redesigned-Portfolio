import { ReactLenis } from 'lenis/react'
import { useReducedMotion } from 'motion/react'

import { AboutSection } from '@/components/about-section'
import { Footer } from '@/components/footer'
import { JournalSection } from '@/components/journal-section'
import { KineticHero } from '@/components/kinetic-hero'
import { ReachSection } from '@/components/reach-section'
import { ScrollProgress } from '@/components/scroll-progress'
import { ServicesSection } from '@/components/services-section'
import { SiteNav } from '@/components/site-nav'
import { SkillsMarquee } from '@/components/skills-marquee'
import { TextScrub } from '@/components/text-scrub'
import { WorkGallery } from '@/components/work-gallery'
import { useReveal } from '@/hooks/use-reveal'
import { cn } from '@/lib/utils'

/** Supporting context that fades in under the big statement. */
function IntroContext() {
  const { ref, visible } = useReveal<HTMLParagraphElement>()

  return (
    <p
      ref={ref}
      className={cn(
        'mt-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg',
        visible ? 'animate-fade-rise' : 'opacity-0',
      )}
      style={visible ? { animationDelay: '0.15s' } : undefined}
    >
      Over the past decade, I&rsquo;ve shipped websites, landing pages, and automations for
      clients across four countries, from family-run shops to international agencies.
      Different industries, one standard: it has to look sharp and it has to work.
    </p>
  )
}

const page = (
  <div className="min-h-screen overflow-x-clip bg-background text-foreground">
    <ScrollProgress />
    <SiteNav />

    <header id="home">
      <KineticHero />
    </header>

      <main>
        {/* Statement - the manifesto moment, with inline graphics */}
        <section aria-label="Introduction" className="mx-auto w-full max-w-6xl px-6 py-28 md:px-8 md:py-44">
          <TextScrub
            className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl"
            segments={[
              'I design',
              { icon: 'sparkle' },
              'and build',
              { icon: 'code' },
              'modern web experiences with clarity, motion, and purpose.',
              { icon: 'target' },
          ]}
        />
        <IntroContext />
      </section>

        <WorkGallery />
        <SkillsMarquee />
        <ServicesSection />
        <AboutSection />
      <JournalSection />
      <ReachSection />
    </main>

    <Footer />
  </div>
)

export default function App() {
  const reduced = useReducedMotion()

  // Lenis gives every scroll a weighted glide; users who ask for
  // reduced motion keep the native scroll.
  if (reduced) {
    return page
  }

  return (
    <ReactLenis root options={{ lerp: 0.09, anchors: true }}>
      {page}
    </ReactLenis>
  )
}
