import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Experience } from '@/components/Experience'
import { Education } from '@/components/Education'
import { Projects } from '@/components/Projects'
import { Skills } from '@/components/Skills'
import { BlogIndex } from '@/components/BlogIndex'
import { Footer } from '@/components/Footer'

// Enable dynamic rendering to show new blog posts immediately
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Experience />
      <Education />
      <Projects />
      <Skills />
      <BlogIndex />
      <Footer />
    </>
  )
}
