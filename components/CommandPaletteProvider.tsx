'use client'

import { useEffect, useState } from 'react'
import { CommandPalette } from './CommandPalette'

interface BlogPost {
  slug: string
  title: string
  description: string
  tags?: Array<{ name: string }>
  published_at?: string
}

export function CommandPaletteProvider() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Lazy load blog posts only when needed
    const loadBlogPosts = async () => {
      if (blogPosts.length > 0 || isLoading) return // Already loaded or loading
      
      try {
        setIsLoading(true)
        const response = await fetch('/api/blog')
        if (response.ok) {
          const data = await response.json()
          setBlogPosts(data.posts || [])
        }
      } catch (error) {
        console.warn('Failed to load blog posts for command palette:', error)
        // Fail silently - command palette will work without blog posts
      } finally {
        setIsLoading(false)
      }
    }

    // Listen for command palette trigger (⌘K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        loadBlogPosts() // Load posts when command palette is about to open
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [blogPosts.length, isLoading])

  return <CommandPalette blogPosts={blogPosts} />
}
