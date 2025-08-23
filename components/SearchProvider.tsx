'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { siteConfig } from '@/lib/siteConfig'

interface SearchResult {
  id: string
  type: 'project' | 'blog' | 'section'
  title: string
  description: string
  content?: string
  url: string
  tags?: string[]
  score: number
  snippet: string
}

interface SearchContextType {
  query: string
  setQuery: (query: string) => void
  results: SearchResult[]
  isLoading: boolean
  searchHistory: string[]
  clearHistory: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  popularQueries: string[]
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

interface SearchProviderProps {
  children: ReactNode
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [popularQueries] = useState([
    'React', 'TypeScript', 'Next.js', 'Projects', 'Blog', 'Portfolio',
    'JavaScript', 'Web Development', 'Frontend', 'Full Stack'
  ])

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('search-history')
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Load blog posts for search
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog')
        if (response.ok) {
          const data = await response.json()
          setBlogPosts(data.posts || [])
        }
      } catch (error) {
        console.warn('Failed to load blog posts for search:', error)
      }
    }

    loadBlogPosts()
  }, [])

  // Search algorithm with fuzzy matching and scoring
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)

    try {
      const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0)
      const allResults: SearchResult[] = []

      // Search projects
      siteConfig.projects.forEach((project, index) => {
        const score = calculateScore(project, searchTerms)
        if (score > 0) {
          allResults.push({
            id: `project-${project.id}`,
            type: 'project',
            title: project.title,
            description: project.description,
            content: project.longDescription,
            url: project.liveUrl || project.githubUrl || '#projects',
            tags: project.technologies,
            score,
            snippet: generateSnippet(project.description + ' ' + project.longDescription, searchTerms)
          })
        }
      })

      // Search blog posts
      blogPosts.forEach((post) => {
        const score = calculateBlogScore(post, searchTerms)
        if (score > 0) {
          allResults.push({
            id: `blog-${post.slug}`,
            type: 'blog',
            title: post.title,
            description: post.description || '',
            content: post.content?.substring(0, 500),
            url: `/blog/${post.slug}`,
            tags: post.tags?.map((tag: any) => tag.name) || [],
            score,
            snippet: generateSnippet(post.description + ' ' + (post.content?.substring(0, 200) || ''), searchTerms)
          })
        }
      })

      // Search site sections
      const sections = [
        { id: 'about', title: 'About Me', description: siteConfig.author.bio, url: '#about' },
        { id: 'experience', title: 'Work Experience', description: 'Professional experience and achievements', url: '#experience' },
        { id: 'education', title: 'Education', description: 'Educational background and qualifications', url: '#education' },
        { id: 'skills', title: 'Skills', description: Object.values(siteConfig.skills).flat().join(', '), url: '#skills' },
        { id: 'contact', title: 'Contact', description: 'Get in touch for collaborations and opportunities', url: '#contact' }
      ]

      sections.forEach((section) => {
        const score = calculateSectionScore(section, searchTerms)
        if (score > 0) {
          allResults.push({
            id: `section-${section.id}`,
            type: 'section',
            title: section.title,
            description: section.description,
            url: section.url,
            score,
            snippet: generateSnippet(section.description, searchTerms)
          })
        }
      })

      // Sort by score (relevance) and limit results
      const sortedResults = allResults
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)

      setResults(sortedResults)

      // Add to search history
      if (searchQuery.length > 2) {
        addToHistory(searchQuery)
      }

    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate relevance score for projects
  const calculateScore = (project: any, searchTerms: string[]): number => {
    let score = 0

    searchTerms.forEach(term => {
      // Title match (highest weight)
      if (project.title.toLowerCase().includes(term)) {
        score += 10
      }

      // Technology match (high weight)
      if (project.technologies.some((tech: string) => tech.toLowerCase().includes(term))) {
        score += 8
      }

      // Description match (medium weight)
      if (project.description.toLowerCase().includes(term)) {
        score += 5
      }

      // Long description match (lower weight)
      if (project.longDescription?.toLowerCase().includes(term)) {
        score += 3
      }

      // Category match
      if (project.category.toLowerCase().includes(term)) {
        score += 4
      }

      // Fuzzy matching for close terms
      if (fuzzyMatch(term, project.title.toLowerCase())) {
        score += 2
      }
    })

    // Bonus for featured projects
    if (project.featured) {
      score += 2
    }

    return score
  }

  // Calculate relevance score for blog posts
  const calculateBlogScore = (post: any, searchTerms: string[]): number => {
    let score = 0

    searchTerms.forEach(term => {
      // Title match (highest weight)
      if (post.title.toLowerCase().includes(term)) {
        score += 10
      }

      // Tag match (high weight)
      if (post.tags?.some((tag: any) => tag.name.toLowerCase().includes(term))) {
        score += 8
      }

      // Description match
      if (post.description?.toLowerCase().includes(term)) {
        score += 5
      }

      // Content match (sample)
      if (post.content?.toLowerCase().includes(term)) {
        score += 3
      }

      // Author match
      if (post.author?.toLowerCase().includes(term)) {
        score += 2
      }
    })

    // Bonus for featured posts
    if (post.featured) {
      score += 2
    }

    return score
  }

  // Calculate relevance score for sections
  const calculateSectionScore = (section: any, searchTerms: string[]): number => {
    let score = 0

    searchTerms.forEach(term => {
      if (section.title.toLowerCase().includes(term)) {
        score += 10
      }
      if (section.description.toLowerCase().includes(term)) {
        score += 5
      }
    })

    return score
  }

  // Simple fuzzy matching
  const fuzzyMatch = (term: string, target: string): boolean => {
    if (term.length < 3) return false
    
    const threshold = 0.8
    const similarity = calculateSimilarity(term, target)
    return similarity >= threshold
  }

  // Calculate string similarity (Levenshtein-based)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const distance = levenshteinDistance(longer, shorter)
    return (longer.length - distance) / longer.length
  }

  // Levenshtein distance calculation
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    return matrix[str2.length][str1.length]
  }

  // Generate search snippet with highlighted terms
  const generateSnippet = (text: string, searchTerms: string[]): string => {
    if (!text) return ''
    
    const maxLength = 120
    let snippet = text.substring(0, maxLength)
    
    // Find the best matching position
    let bestPosition = 0
    let maxMatches = 0
    
    for (let i = 0; i < Math.max(0, text.length - maxLength); i += 20) {
      const segment = text.substring(i, i + maxLength).toLowerCase()
      const matches = searchTerms.reduce((count, term) => {
        return count + (segment.includes(term.toLowerCase()) ? 1 : 0)
      }, 0)
      
      if (matches > maxMatches) {
        maxMatches = matches
        bestPosition = i
      }
    }
    
    snippet = text.substring(bestPosition, bestPosition + maxLength)
    if (bestPosition > 0) snippet = '...' + snippet
    if (bestPosition + maxLength < text.length) snippet = snippet + '...'
    
    return snippet
  }

  // Add query to search history
  const addToHistory = (searchQuery: string) => {
    const newHistory = [searchQuery, ...searchHistory.filter(q => q !== searchQuery)].slice(0, 10)
    setSearchHistory(newHistory)
    localStorage.setItem('search-history', JSON.stringify(newHistory))
  }

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('search-history')
  }

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, blogPosts])

  const contextValue: SearchContextType = {
    query,
    setQuery,
    results,
    isLoading,
    searchHistory,
    clearHistory,
    isOpen,
    setIsOpen,
    popularQueries
  }

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
