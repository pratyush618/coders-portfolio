'use client'

import { motion } from 'framer-motion'
import { MapPin, Mail, Calendar, Download } from 'lucide-react'
import { siteConfig } from '@/lib/siteConfig'
import { useState } from 'react'

export function About() {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleResumeDownload = async () => {
    try {
      setIsDownloading(true)
      
      // Track the download (optional analytics)
      await fetch('/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {}) // Silently fail analytics tracking
      
      // Download the resume
      const response = await fetch('/api/resume')
      
      if (!response.ok) {
        throw new Error('Failed to download resume')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Pratyush_Sharma_Resume.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
    } catch (error) {
      console.error('Error downloading resume:', error)
      // Fallback to direct file download
      const a = document.createElement('a')
      a.href = '/resume.pdf'
      a.download = 'Pratyush_Sharma_Resume.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <section id="about" className="section-padding bg-bg-secondary/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
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
              About Me
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="body-large max-w-2xl mx-auto"
            >
              Get to know more about my background, skills, and what drives me as a developer.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 lg:col-span-1"
            >
              <div className="card p-6">
                <h3 className="heading-4 text-text mb-6">Personal Info</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="body-base">{siteConfig.author.location}</span>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <a
                      href={`mailto:${siteConfig.author.email}`}
                      className="body-base link break-words min-w-0 flex-1"
                      title={siteConfig.author.email}
                    >
                      {siteConfig.author.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="body-base">Available for projects</span>
                  </div>
                </div>

                {/* Download Resume Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleResumeDownload}
                  disabled={isDownloading}
                  className="btn-primary w-full mt-6 flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>{isDownloading ? 'Downloading...' : 'Download Resume'}</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Bio and Story */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 lg:col-span-2"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="heading-4 text-text mb-4">My Story</h3>
                  <div className="prose prose-lg max-w-none text-text-secondary space-y-4">
                    <p>
                      {siteConfig.author.bio}
                    </p>
                    
                    <p>
                      My approach to development is centered around creating solutions that are not only 
                      technically sound but also accessible, performant, and user-friendly. I believe in 
                      writing clean, maintainable code and following best practices that scale with growing teams and products.
                    </p>
                    
                    <p>
                      Whether it's architecting a complex web application, optimizing for performance, 
                      or implementing accessibility features, I'm passionate about leveraging technology 
                      to solve real-world problems and create meaningful digital experiences.
                    </p>
                  </div>
                </div>

                {/* Current Focus */}
                <div>
                  <h3 className="heading-4 text-text mb-4">Current Focus</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="card p-4">
                      <h4 className="font-semibold text-text mb-2">Modern Web Development</h4>
                      <p className="body-small">
                        Building scalable applications with Next.js, React, and TypeScript
                      </p>
                    </div>
                    
                    <div className="card p-4">
                      <h4 className="font-semibold text-text mb-2">Developer Experience</h4>
                      <p className="body-small">
                        Creating tools and processes that improve developer productivity
                      </p>
                    </div>
                    
                    <div className="card p-4">
                      <h4 className="font-semibold text-text mb-2">Accessibility</h4>
                      <p className="body-small">
                        Ensuring web applications are usable by everyone, regardless of ability
                      </p>
                    </div>
                    
                    <div className="card p-4">
                      <h4 className="font-semibold text-text mb-2">Performance</h4>
                      <p className="body-small">
                        Optimizing applications for speed, efficiency, and great user experience
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
