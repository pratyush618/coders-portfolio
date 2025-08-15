'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'
import Image from 'next/image'

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

interface ProjectCardProps {
  project: Project
  index: number
  onViewDetails: (project: Project) => void
}

function ProjectCardComponent({ project, index, onViewDetails }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        ease: [0.25, 0.25, 0, 1]
      }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -12,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={`group stagger-${Math.min(index + 1, 6)}`}
    >
      <motion.div 
        className="card-hover h-full overflow-hidden relative"
        whileHover={{
          boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.25)",
          borderColor: "rgba(6, 182, 212, 0.5)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        {/* Project Image */}
        <div className="relative h-48 bg-bg-secondary overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
          
          {/* Featured badge with glow animation */}
          {project.featured && (
            <div className="absolute top-4 right-4">
              <motion.span 
                className="px-2 py-1 bg-accent text-bg text-xs font-semibold rounded-full"
                animate={{ 
                  boxShadow: [
                    "0 0 0px rgba(6, 182, 212, 0.5)",
                    "0 0 15px rgba(6, 182, 212, 0.8)",
                    "0 0 0px rgba(6, 182, 212, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Featured
              </motion.span>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <motion.span 
              className="px-2 py-1 bg-bg/90 backdrop-blur-sm text-text text-xs font-medium rounded-full border border-border"
              whileHover={{ scale: 1.05, borderColor: "rgba(6, 182, 212, 0.5)" }}
              transition={{ duration: 0.2 }}
            >
              {project.category}
            </motion.span>
          </div>

          {/* Enhanced Overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Quick actions with enhanced animations */}
          <motion.div 
            className="absolute bottom-4 right-4 flex space-x-2"
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, staggerChildren: 0.1 }}
          >
            <motion.a
              initial={{ scale: 0, rotate: -180 }}
              whileHover={{ 
                scale: 1.2, 
                rotate: 0,
                boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)"
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-bg/90 backdrop-blur-sm rounded-full text-text hover:text-accent transition-colors"
              aria-label="View live project"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
            </motion.a>
            
            <motion.a
              initial={{ scale: 0, rotate: 180 }}
              whileHover={{ 
                scale: 1.2, 
                rotate: 0,
                boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)"
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-bg/90 backdrop-blur-sm rounded-full text-text hover:text-accent transition-colors"
              aria-label="View source code"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="h-4 w-4" />
            </motion.a>
          </motion.div>
        </div>

        {/* Project Content */}
        <div className="p-6 pb-8 relative z-10">
          <motion.h3 
            className="heading-4 text-text mb-2 group-hover:text-accent transition-colors"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            {project.title}
          </motion.h3>
          
          <p className="body-base mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Technologies with stagger animation */}
          <motion.div 
            className="flex flex-wrap gap-2 mb-8"
            whileHover="hover"
          >
            {project.technologies.slice(0, 4).map((tech, techIndex) => (
              <motion.span
                key={tech}
                className="px-2 py-1 bg-bg-secondary border border-border rounded text-xs text-text-secondary hover:text-accent hover:border-accent/50 transition-all cursor-default"
                variants={{
                  hover: {
                    scale: 1.05,
                    transition: {
                      delay: techIndex * 0.05
                    }
                  }
                }}
                whileHover={{ 
                  backgroundColor: "rgba(6, 182, 212, 0.1)",
                  borderColor: "rgba(6, 182, 212, 0.5)"
                }}
              >
                {tech}
              </motion.span>
            ))}
            {project.technologies.length > 4 && (
              <motion.span 
                className="px-2 py-1 bg-bg-secondary border border-border rounded text-xs text-accent"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                +{project.technologies.length - 4} more
              </motion.span>
            )}
          </motion.div>

          {/* Actions with proper vertical arrangement */}
          <div className="space-y-4">
            {/* Main actions row - Live Demo and Code side by side */}
            <div className="flex items-center justify-between">
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 text-sm font-medium text-neon-cyan hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="p-1.5 rounded-full bg-neon-cyan/10 group-hover:bg-neon-cyan/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </motion.div>
                <span>Live Demo</span>
              </motion.a>
              
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <Github className="h-3.5 w-3.5" />
                </motion.div>
                <span>Code</span>
              </motion.a>
            </div>

            {/* View Details button below - centered */}
            <div className="flex justify-center pt-2">
              <motion.button
                whileHover={{ x: 4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onViewDetails(project)}
                className="group flex items-center space-x-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-200"
              >
                <span>View Details</span>
                <motion.div
                  className="transition-transform group-hover:translate-x-1"
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </motion.div>
              </motion.button>
            </div>

            {/* Separator line */}
            <motion.div 
              className="h-px bg-gradient-to-r from-transparent via-border to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const ProjectCard = memo(ProjectCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.project.id === nextProps.project.id &&
    prevProps.index === nextProps.index &&
    prevProps.onViewDetails === nextProps.onViewDetails
  )
})
