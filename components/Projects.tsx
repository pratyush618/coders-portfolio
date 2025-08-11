'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github, Search, Filter, Star } from 'lucide-react'
import Image from 'next/image'
import { siteConfig } from '@/lib/siteConfig'
import { ProjectCard } from './ProjectCard'
import { useDebounce } from '@/hooks/useDebounce'

interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  technologies: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
  category: string
}

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState<'all' | 'featured' | string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'default' | 'title' | 'featured'>('default')

  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Memoize categories to prevent recalculation
  const categories = useMemo(() => 
    ['all', 'featured', ...Array.from(new Set(siteConfig.projects.map(p => p.category)))],
    []
  )
  
  // Optimized filtering and sorting with debounced search
  const filteredProjects = useMemo(() => {
    let filtered = siteConfig.projects.filter(project => {
      // Filter by category
      const categoryMatch = 
        filter === 'all' || 
        (filter === 'featured' && project.featured) ||
        project.category === filter

      // Filter by debounced search query
      const searchMatch = debouncedSearchQuery === '' || 
        project.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))

      return categoryMatch && searchMatch
    })

    // Sort projects
    if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'featured') {
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
    // 'default' keeps original order

    return filtered
  }, [filter, debouncedSearchQuery, sortBy])

  // Memoized handlers
  const handleViewDetails = useCallback((project: Project) => {
    setSelectedProject(project)
  }, [])

  const closeModal = useCallback(() => {
    setSelectedProject(null)
  }, [])

  const handleFilterChange = useCallback((newFilter: string) => {
    setFilter(newFilter)
  }, [])

  const handleSortChange = useCallback((newSort: string) => {
    setSortBy(newSort as typeof sortBy)
  }, [])

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setFilter('all')
  }, [])

  return (
    <section id="projects" className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="heading-2 text-text mb-4"
            >
              Featured Projects
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="body-large max-w-2xl mx-auto"
            >
              A showcase of my recent work, featuring modern web applications built with cutting-edge technologies.
            </motion.p>
          </div>

          {/* Search and Filter Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
            suppressHydrationWarning
          >
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-6" suppressHydrationWarning>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-text-secondary" />
                </div>
                <motion.input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  whileFocus={{ 
                    boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.2)",
                    borderColor: "rgb(6, 182, 212)"
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-bg-secondary border border-border rounded-lg text-text placeholder-text-secondary focus:outline-none focus:border-accent transition-all duration-300"
                  suppressHydrationWarning
                />
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-accent"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => handleFilterChange(category)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      filter === category
                        ? 'bg-accent text-bg shadow-lg shadow-accent/25'
                        : 'bg-bg-secondary text-text-secondary hover:text-text hover:bg-border border border-border'
                    }`}
                  >
                    <span className="flex items-center space-x-1">
                      {category === 'featured' && <Star className="h-3 w-3" />}
                      <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-text-secondary" />
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent transition-colors"
                >
                  <option value="default">Default Order</option>
                  <option value="title">Alphabetical</option>
                  <option value="featured">Featured First</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <motion.div 
              className="text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={`${filteredProjects.length}-${debouncedSearchQuery}-${filter}`}
            >
              <span className="text-sm text-text-secondary">
                {filteredProjects.length === 0 ? 'No projects found' : 
                 `Showing ${filteredProjects.length} ${filteredProjects.length === 1 ? 'project' : 'projects'}`}
                {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
                {filter !== 'all' && ` in ${filter}`}
              </span>
            </motion.div>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-md mx-auto"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-bg-secondary rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-text-secondary" />
                </div>
                <h3 className="heading-4 text-text mb-2">No projects found</h3>
                <p className="body-base mb-6">
                  {debouncedSearchQuery 
                    ? `No projects match "${debouncedSearchQuery}" in ${filter === 'all' ? 'any category' : filter}`
                    : `No projects found in the ${filter} category`
                  }
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearFilters}
                  className="btn-secondary"
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Enhanced Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/90 backdrop-blur-md"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateX: 15 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
                duration: 0.6 
              }}
              className="relative w-full max-w-6xl max-h-[95vh] bg-bg border border-border rounded-3xl overflow-hidden shadow-2xl shadow-accent/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                onClick={closeModal}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-6 right-6 z-20 p-3 bg-bg/90 backdrop-blur-sm rounded-full text-text hover:text-accent transition-all duration-300 shadow-lg"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </motion.button>

              <div className="overflow-y-auto max-h-[95vh]">
                {/* Project Image with Parallax Effect */}
                <motion.div 
                  className="relative h-80 sm:h-96 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 90vw"
                    priority
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
                  
                  {/* Floating Badges */}
                  <motion.div 
                    className="absolute top-6 left-6 flex flex-wrap gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.span 
                      className="px-4 py-2 bg-bg/90 backdrop-blur-sm text-text text-sm font-medium rounded-full border border-border shadow-lg"
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {selectedProject.category}
                    </motion.span>
                    {selectedProject.featured && (
                      <motion.span 
                        className="px-4 py-2 bg-accent text-bg text-sm font-semibold rounded-full shadow-lg"
                        whileHover={{ scale: 1.05, y: -2 }}
                        animate={{ 
                          boxShadow: [
                            "0 0 0px rgba(6, 182, 212, 0.5)",
                            "0 0 20px rgba(6, 182, 212, 0.8)",
                            "0 0 0px rgba(6, 182, 212, 0.5)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ⭐ Featured
                      </motion.span>
                    )}
                  </motion.div>

                  {/* Project Title Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <motion.h3 
                      className="heading-1 text-text mb-2"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {selectedProject.title}
                    </motion.h3>
                  </div>
                </motion.div>

                {/* Enhanced Content Section */}
                <div className="p-8 lg:p-12">
                  <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Description */}
                    <div className="lg:col-span-2 space-y-8">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h4 className="heading-3 text-text mb-4">About This Project</h4>
                        <p className="body-large leading-relaxed">{selectedProject.longDescription}</p>
                      </motion.div>

                      {/* Technologies with Enhanced Design */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <h4 className="heading-3 text-text mb-6">Technologies & Tools</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {selectedProject.technologies.map((tech, index) => (
                            <motion.div
                              key={tech}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + index * 0.05 }}
                              whileHover={{ 
                                scale: 1.05, 
                                y: -2,
                                boxShadow: "0 10px 25px rgba(6, 182, 212, 0.15)"
                              }}
                              className="p-4 bg-bg-secondary border border-border rounded-xl text-center hover:border-accent/50 transition-all duration-300"
                            >
                              <span className="text-sm font-medium text-text">{tech}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    {/* Sidebar with Stats and Actions */}
                    <div className="lg:col-span-1">
                      <motion.div 
                        className="sticky top-8 space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        {/* Project Stats */}
                        <div className="card p-6">
                          <h5 className="heading-4 text-text mb-4">Project Stats</h5>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-text-secondary">Technologies</span>
                              <span className="text-sm font-semibold text-accent">
                                {selectedProject.technologies.length}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-text-secondary">Category</span>
                              <span className="text-sm font-semibold text-text">
                                {selectedProject.category}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-text-secondary">Status</span>
                              <span className="text-sm font-semibold text-green-400">
                                Live
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                          <motion.a
                            whileHover={{ 
                              scale: 1.02,
                              boxShadow: "0 0 30px rgba(6, 182, 212, 0.4)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            href={selectedProject.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full btn-primary flex items-center justify-center space-x-2 group"
                          >
                            <ExternalLink className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                            <span>View Live Demo</span>
                          </motion.a>
                          
                          <motion.a
                            whileHover={{ 
                              scale: 1.02,
                              borderColor: "rgb(6, 182, 212)",
                              boxShadow: "0 0 20px rgba(6, 182, 212, 0.2)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            href={selectedProject.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full btn-secondary flex items-center justify-center space-x-2 group"
                          >
                            <Github className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                            <span>View Source Code</span>
                          </motion.a>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
