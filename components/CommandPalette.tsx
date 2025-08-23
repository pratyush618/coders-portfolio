'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  FileText, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Mail, 
  ExternalLink,
  Hash,
  Calendar
} from 'lucide-react'
import { siteConfig } from '@/lib/siteConfig'

interface CommandItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: () => void
  category: 'navigation' | 'projects' | 'blog' | 'external'
  keywords: string[]
}

interface CommandPaletteProps {
  blogPosts?: Array<{
    slug: string
    title: string
    description: string
    tags?: Array<{ name: string }>
    published_at?: string
  }>
}

export function CommandPalette({ blogPosts = [] }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Navigation commands
  const navigationCommands: CommandItem[] = [
    {
      id: 'about',
      title: 'About',
      description: 'Learn about my background and experience',
      icon: <User className="w-4 h-4" />,
      action: () => scrollToSection('about'),
      category: 'navigation',
      keywords: ['about', 'bio', 'background', 'me', 'profile']
    },
    {
      id: 'experience',
      title: 'Experience',
      description: 'View my work experience and career history',
      icon: <Briefcase className="w-4 h-4" />,
      action: () => scrollToSection('experience'),
      category: 'navigation',
      keywords: ['experience', 'work', 'career', 'job', 'history']
    },
    {
      id: 'education',
      title: 'Education',
      description: 'See my educational background',
      icon: <GraduationCap className="w-4 h-4" />,
      action: () => scrollToSection('education'),
      category: 'navigation',
      keywords: ['education', 'school', 'degree', 'learning', 'university']
    },
    {
      id: 'projects',
      title: 'Projects',
      description: 'Explore my portfolio projects',
      icon: <Code className="w-4 h-4" />,
      action: () => scrollToSection('projects'),
      category: 'navigation',
      keywords: ['projects', 'portfolio', 'work', 'code', 'development']
    },
    {
      id: 'skills',
      title: 'Skills',
      description: 'View my technical skills and expertise',
      icon: <Hash className="w-4 h-4" />,
      action: () => scrollToSection('skills'),
      category: 'navigation',
      keywords: ['skills', 'technologies', 'expertise', 'tools', 'tech']
    },
    {
      id: 'blog',
      title: 'Blog',
      description: 'Read my latest blog posts',
      icon: <FileText className="w-4 h-4" />,
      action: () => scrollToSection('blog'),
      category: 'navigation',
      keywords: ['blog', 'articles', 'posts', 'writing', 'thoughts']
    },
    {
      id: 'contact',
      title: 'Contact',
      description: 'Get in touch with me',
      icon: <Mail className="w-4 h-4" />,
      action: () => scrollToSection('contact'),
      category: 'navigation',
      keywords: ['contact', 'email', 'reach', 'message', 'connect']
    }
  ]

  // Project commands
  const projectCommands: CommandItem[] = siteConfig.projects.map(project => ({
    id: `project-${project.id}`,
    title: project.title,
    description: project.description,
    icon: <Code className="w-4 h-4" />,
    action: () => {
      if (project.liveUrl) {
        window.open(project.liveUrl, '_blank')
      } else if (project.githubUrl) {
        window.open(project.githubUrl, '_blank')
      }
    },
    category: 'projects' as const,
    keywords: [
      project.title.toLowerCase(),
      ...project.technologies.map(tech => tech.toLowerCase()),
      project.category.toLowerCase(),
      'project'
    ]
  }))

  // Blog post commands
  const blogCommands: CommandItem[] = blogPosts.map(post => ({
    id: `blog-${post.slug}`,
    title: post.title,
    description: post.description,
    icon: <FileText className="w-4 h-4" />,
    action: () => {
      window.location.href = `/blog/${post.slug}`
    },
    category: 'blog' as const,
    keywords: [
      post.title.toLowerCase(),
      ...(post.tags?.map(tag => tag.name.toLowerCase()) || []),
      'blog',
      'post',
      'article'
    ]
  }))

  // External commands
  const externalCommands: CommandItem[] = [
    {
      id: 'github',
      title: 'GitHub Profile',
      description: 'View my GitHub repositories',
      icon: <ExternalLink className="w-4 h-4" />,
      action: () => window.open(siteConfig.social.github, '_blank'),
      category: 'external',
      keywords: ['github', 'code', 'repositories', 'open source']
    },
    {
      id: 'linkedin',
      title: 'LinkedIn Profile',
      description: 'Connect with me on LinkedIn',
      icon: <ExternalLink className="w-4 h-4" />,
      action: () => window.open(siteConfig.social.linkedin, '_blank'),
      category: 'external',
      keywords: ['linkedin', 'professional', 'network', 'connect']
    }
  ]

  const allCommands = [
    ...navigationCommands,
    ...projectCommands,
    ...blogCommands,
    ...externalCommands
  ]

  const filteredCommands = useMemo(() => {
    if (!search) return allCommands

    const searchLower = search.toLowerCase()
    return allCommands.filter(command =>
      command.title.toLowerCase().includes(searchLower) ||
      command.description.toLowerCase().includes(searchLower) ||
      command.keywords.some(keyword => keyword.includes(searchLower))
    )
  }, [search, allCommands])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setOpen(false)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setOpen(true)
      setSearch('')
      setSelectedIndex(0)
    }
    
    if (open) {
      if (e.key === 'Escape') {
        setOpen(false)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action()
          setOpen(false)
        }
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, selectedIndex, filteredCommands])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return '🧭'
      case 'projects': return '🚀'
      case 'blog': return '📝'
      case 'external': return '🔗'
      default: return '🔍'
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setOpen(false)}
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-bg-secondary border border-accent/20 rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{
              boxShadow: '0 0 50px rgba(6, 182, 212, 0.3)'
            }}
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-3 border-b border-accent/10">
              <Search className="w-5 h-5 text-accent mr-3" />
              <input
                type="text"
                placeholder="Search commands... (⌘K)"
                className="flex-1 bg-transparent text-text placeholder-text-secondary outline-none text-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-text-secondary bg-bg rounded">
                <span>ESC</span>
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCommands.length > 0 ? (
                <div className="py-2">
                  {/* Group commands by category */}
                  {['navigation', 'projects', 'blog', 'external'].map(category => {
                    const categoryCommands = filteredCommands.filter(cmd => cmd.category === category)
                    if (categoryCommands.length === 0) return null

                    return (
                      <div key={category} className="mb-2">
                        <div className="px-4 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                          <span>{getCategoryIcon(category)}</span>
                          {category}
                        </div>
                        {categoryCommands.map((command, index) => {
                          const globalIndex = filteredCommands.indexOf(command)
                          return (
                            <motion.div
                              key={command.id}
                              className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                                selectedIndex === globalIndex
                                  ? 'bg-accent/10 border-l-2 border-accent'
                                  : 'hover:bg-accent/5'
                              }`}
                              onClick={() => {
                                command.action()
                                setOpen(false)
                              }}
                              whileHover={{ x: selectedIndex === globalIndex ? 0 : 4 }}
                            >
                              <div className="flex-shrink-0 text-accent">
                                {command.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-text truncate">
                                  {command.title}
                                </div>
                                <div className="text-sm text-text-secondary truncate">
                                  {command.description}
                                </div>
                              </div>
                              {selectedIndex === globalIndex && (
                                <div className="text-xs text-accent">
                                  ⏎
                                </div>
                              )}
                            </motion.div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-text-secondary">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No commands found</p>
                  <p className="text-xs mt-1">Try searching for something else</p>
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
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-bg-secondary rounded">ESC</kbd>
                Close
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
