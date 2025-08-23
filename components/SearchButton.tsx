'use client'

import { Search } from 'lucide-react'
import { useSearch } from './SearchProvider'

export function SearchButton() {
  const { setIsOpen } = useSearch()

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="flex items-center gap-2 px-4 py-2 bg-bg-secondary/80 backdrop-blur-sm border border-accent/20 rounded-lg hover:border-accent/40 transition-all duration-200 text-text-secondary hover:text-text group"
      title="Search (Ctrl+/)"
    >
      <Search className="w-4 h-4 group-hover:text-accent transition-colors" />
      <span className="text-sm">Search...</span>
      <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-mono bg-bg/50 rounded border border-border">
        <span>⌘/</span>
      </kbd>
    </button>
  )
}
