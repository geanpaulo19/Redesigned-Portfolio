import { ReactLenis } from 'lenis/react'
import { useReducedMotion } from 'motion/react'

import { AboutSection } from '@/components/about-section'
import { Footer } from '@/components/footer'
import { JournalSection } from '@/components/journal-section'
import { KineticHero } from '@/components/kinetic-hero'
import { ReachSection } from '@/components/reach-section'
import { ScrollProgress } from '@/components/scroll-progress'
import { SiteNav } from '@/components/site-nav'
import { SkillsMarquee } from '@/components/skills-marquee'
import { TextScrub } from '@/components/text-scrub'
import { WorkGallery } from '@/components/work-gallery'

const page = (
  <div className="min-h-screen overflow-x-clip bg-background text-foreground">
    <ScrollProgress />
    <SiteNav />

    <header id="home">
      <KineticHero />
    </header>

    <main>
      {/* Statement - the manifesto moment */}
      <section aria-label="Introduction" className="mx-auto w-full max-w-6xl px-6 py-28 md:px-8 md:py-44">
        <TextScrub
          text="I design and build modern web experiences with clarity, motion, and purpose."
          className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl"
        />
      </section>

      <WorkGallery />
      <SkillsMarquee />
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
