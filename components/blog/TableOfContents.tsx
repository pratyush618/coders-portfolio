'use client'

import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'

// Separate component for progress to avoid re-rendering the entire TOC
function ProgressIndicator() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
      setProgress(scrollPercent)
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="mt-4 pt-3 border-t border-border">
      <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-bg rounded-full h-1">
        <div 
          className="bg-accent h-1 rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isVisible, setIsVisible] = useState(false)

  // Extract headings from content
  useEffect(() => {
    const extractHeadings = () => {
      const headingRegex = /^(#{1,6})\s+(.+)$/gm
      const extractedHeadings: Heading[] = []
      let match

      while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length
        const text = match[2].trim()
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')

        extractedHeadings.push({ id, text, level })
      }

      setHeadings(extractedHeadings)
    }

    extractHeadings()
  }, [content])

  // Track scroll position and update active heading
  useEffect(() => {
    const handleScroll = () => {
      if (headings.length === 0) return

      const scrollPosition = window.scrollY + 100 // Offset for better UX
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean)
      
      let currentActive = ''

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i]
        if (element && element.offsetTop <= scrollPosition) {
          currentActive = element.id
          break
        }
      }

      setActiveId(currentActive)

      // Show/hide TOC based on scroll position
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  // Scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Account for fixed header
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  if (headings.length === 0) return null

  return (
    <div 
      className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
      }`}
    >
      <div className="bg-bg-secondary/90 backdrop-blur-sm border border-border rounded-lg p-4 max-w-xs max-h-[60vh] overflow-y-auto">
        <div className="flex items-center space-x-2 mb-3 text-text-secondary">
          <div className="w-2 h-2 bg-accent rounded-full"></div>
          <span className="text-sm font-semibold uppercase tracking-wide">Contents</span>
        </div>
        
        <nav className="space-y-1">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={`
                group flex items-start space-x-2 w-full text-left text-sm py-1.5 px-2 rounded
                transition-all duration-200 hover:bg-bg/50
                ${activeId === heading.id 
                  ? 'text-accent bg-accent/10 border-l-2 border-accent' 
                  : 'text-text-secondary hover:text-text'
                }
              `}
              style={{ 
                paddingLeft: `${(heading.level - 1) * 12 + 8}px`,
                marginLeft: activeId === heading.id ? '-2px' : '0'
              }}
            >
              <ChevronRight 
                className={`
                  w-3 h-3 mt-0.5 transition-transform duration-200 opacity-50
                  ${activeId === heading.id ? 'rotate-90 opacity-100' : 'group-hover:opacity-75'}
                `} 
              />
              <span className="leading-tight">{heading.text}</span>
            </button>
          ))}
        </nav>

        {/* Progress indicator */}
        <ProgressIndicator />
      </div>
    </div>
  )
}