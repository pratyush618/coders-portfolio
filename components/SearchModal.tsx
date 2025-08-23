'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp, 
  FileText, 
  Code, 
  User,
  ExternalLink,
  ArrowRight,
  Zap
} from 'lucide-react'
import { useSearch } from './SearchProvider'

export function SearchModal() {
  const {
    query,
    setQuery,
    results,
    isLoading,
    searchHistory,
    clearHistory,
    isOpen,
    setIsOpen,
    popularQueries
  } = useSearch()

  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultRefs = useRef<(HTMLDivElement | null)[]>([])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + / to open search
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        setIsOpen(true)
        setQuery('')
        setSelectedIndex(0)
      }

      if (isOpen) {
        if (e.key === 'Escape') {
          setIsOpen(false)
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
        } else if (e.key === 'Enter') {
          e.preventDefault()
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex])
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, results])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  // Scroll selected result into view
  useEffect(() => {
    if (resultRefs.current[selectedIndex]) {
      resultRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [selectedIndex])

  const handleResultClick = (result: any) => {
    if (result.url.startsWith('#')) {
      // Internal section navigation
      setIsOpen(false)
      const element = document.querySelector(result.url)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else if (result.url.startsWith('http')) {
      // External link
      window.open(result.url, '_blank')
      setIsOpen(false)
    } else {
      // Internal page navigation
      window.location.href = result.url
    }
  }

  const handleQuickQuery = (quickQuery: string) => {
    setQuery(quickQuery)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Code className="w-4 h-4 text-blue-400" />
      case 'blog':
        return <FileText className="w-4 h-4 text-green-400" />
      case 'section':
        return <User className="w-4 h-4 text-purple-400" />
      default:
        return <Search className="w-4 h-4 text-text-secondary" />
    }
  }

  const getResultBadge = (type: string) => {
    const badges = {
      project: { label: 'Project', color: 'bg-blue-500/20 text-blue-400' },
      blog: { label: 'Blog', color: 'bg-green-500/20 text-green-400' },
      section: { label: 'Section', color: 'bg-purple-500/20 text-purple-400' }
    }
    
    const badge = badges[type as keyof typeof badges] || { label: 'Result', color: 'bg-gray-500/20 text-gray-400' }
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  const highlightText = (text: string, query: string) => {
    if (!query) return text
    
    const regex = new RegExp(`(${query.split(' ').join('|')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-accent/30 text-accent px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-16 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-auto bg-bg-secondary border border-accent/20 rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-hidden"
            style={{
              boxShadow: '0 0 50px rgba(6, 182, 212, 0.3)'
            }}
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-3 border-b border-accent/10">
              <Search className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search projects, blog posts, and more... (Ctrl+/)"
                className="flex-1 bg-transparent text-text placeholder-text-secondary outline-none text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-text-secondary hover:text-text transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-text-secondary bg-bg rounded ml-3">
                <span>ESC</span>
              </kbd>
            </div>

            {/* Search Content */}
            <div className="max-h-96 overflow-y-auto">
              {!query && (
                <div className="p-4">
                  {/* Popular Queries */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      <span className="text-sm font-semibold text-text">Popular Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularQueries.map((popularQuery) => (
                        <button
                          key={popularQuery}
                          onClick={() => handleQuickQuery(popularQuery)}
                          className="px-3 py-1 text-sm bg-bg border border-border rounded-full hover:border-accent hover:bg-accent/5 transition-colors text-text-secondary hover:text-text"
                        >
                          {popularQuery}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search History */}
                  {searchHistory.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-accent" />
                          <span className="text-sm font-semibold text-text">Recent Searches</span>
                        </div>
                        <button
                          onClick={clearHistory}
                          className="text-xs text-text-secondary hover:text-text transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="space-y-1">
                        {searchHistory.slice(0, 5).map((historyQuery, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickQuery(historyQuery)}
                            className="w-full text-left px-3 py-2 hover:bg-accent/5 rounded-lg transition-colors text-text-secondary hover:text-text text-sm"
                          >
                            {historyQuery}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {query && (
                <div className="p-2">
                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
                    </div>
                  )}

                  {!isLoading && results.length === 0 && (
                    <div className="text-center py-8">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50 text-text-secondary" />
                      <p className="text-text-secondary">No results found</p>
                      <p className="text-xs text-text-secondary mt-1">
                        Try searching for "projects", "blog", or specific technologies
                      </p>
                    </div>
                  )}

                  {!isLoading && results.length > 0 && (
                    <div className="space-y-1">
                      {results.map((result, index) => (
                        <motion.div
                          key={result.id}
                          ref={el => resultRefs.current[index] = el}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            selectedIndex === index
                              ? 'bg-accent/10 border border-accent/20'
                              : 'hover:bg-accent/5 border border-transparent'
                          }`}
                          onClick={() => handleResultClick(result)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getResultIcon(result.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-text truncate">
                                  {highlightText(result.title, query)}
                                </h4>
                                {getResultBadge(result.type)}
                              </div>
                              
                              <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                                {highlightText(result.snippet, query)}
                              </p>
                              
                              {result.tags && result.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {result.tags.slice(0, 3).map((tag, tagIndex) => (
                                    <span
                                      key={tagIndex}
                                      className="px-2 py-0.5 text-xs bg-bg border border-border rounded text-text-secondary"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {result.tags.length > 3 && (
                                    <span className="px-2 py-0.5 text-xs text-text-secondary">
                                      +{result.tags.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-text-secondary">
                                  Relevance: {Math.round(result.score)}%
                                </span>
                                {selectedIndex === index && (
                                  <div className="flex items-center gap-1 text-xs text-accent">
                                    <span>Enter to open</span>
                                    {result.url.startsWith('http') && (
                                      <ExternalLink className="w-3 h-3" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-accent/10 bg-bg/50 text-xs text-text-secondary flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-bg-secondary rounded">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-bg-secondary rounded">⏎</kbd>
                  Select
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-accent" />
                <span>Powered by fuzzy search</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
