'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail, Twitter } from 'lucide-react'
import { siteConfig } from '@/lib/siteConfig'
import { scrollToElement } from '@/lib/utils'
import { ParticleBackground } from './ParticleBackground'
import { MatrixRain } from './MatrixRain'
import { HexGrid } from './HexGrid'
import { GlitchText } from './GlitchText'
import { DataStream } from './DataStream'

export function Hero() {
  const handleScrollToAbout = () => {
    scrollToElement('about')
  }

  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    email: Mail,
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Simplified background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle matrix rain background */}
      <div className="absolute inset-0 opacity-10">
        <MatrixRain />
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-neon-green/10 border border-neon-green/30 rounded-lg mb-8"
          >
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            <span className="font-mono text-sm text-neon-green">
              <GlitchText intensity="low" trigger="continuous">
                {'> SYSTEM_ONLINE'}
              </GlitchText>
            </span>
          </motion.div>

          {/* Main Name - Simplified */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4">
              <GlitchText intensity="medium" trigger="hover">
                {siteConfig.author.name}
              </GlitchText>
            </h1>
            
            {/* Role with better styling */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="inline-block px-6 py-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg"
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-mono text-neon-cyan">
                <GlitchText intensity="low" trigger="hover">
                  {siteConfig.author.role}
                </GlitchText>
              </h2>
            </motion.div>
          </motion.div>

          {/* Description with better spacing */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Specializing in modern web technologies, TypeScript, and creating
            exceptional user experiences. Let's build something amazing together.
          </motion.p>

          {/* Social links - Cleaner design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex justify-center space-x-4 mb-10"
          >
            {Object.entries(siteConfig.social).map(([platform, url], index) => {
              const Icon = socialIcons[platform as keyof typeof socialIcons]
              if (!Icon) return null

              return (
                <motion.a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.1,
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all duration-300"
                  aria-label={`Follow on ${platform}`}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              )
            })}
          </motion.div>

          {/* CTA Buttons - Improved design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 0 30px rgba(6, 182, 212, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleScrollToAbout}
              className="group relative px-8 py-4 bg-neon-cyan text-black font-mono text-sm font-semibold rounded-lg transition-all duration-300 hover:bg-neon-cyan/90 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>{'> INITIALIZE_PROFILE.EXE'}</span>
              </span>
            </motion.button>
            
            <motion.a
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              whileHover={{ 
                scale: 1.02,
                borderColor: "rgb(6, 182, 212)"
              }}
              whileTap={{ scale: 0.98 }}
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 border-2 border-white/20 text-white font-mono text-sm font-semibold rounded-lg transition-all duration-300 hover:border-neon-cyan hover:text-neon-cyan hover:bg-neon-cyan/5"
            >
              <span className="flex items-center justify-center space-x-2">
                <Github className="h-4 w-4" />
                <span>{'> ACCESS_REPOSITORY'}</span>
              </span>
            </motion.a>
          </motion.div>

        </div>
      </div>
      
      {/* Scroll indicator - Fixed positioning */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.button
          onClick={handleScrollToAbout}
          animate={{ 
            y: [0, 8, 0],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{
            scale: 1.1,
          }}
          whileTap={{ scale: 0.95 }}
          className="group flex flex-col items-center space-y-2 text-white/60 hover:text-neon-cyan transition-colors duration-300"
          aria-label="Scroll to content"
        >
          <span className="font-mono text-xs">SCROLL</span>
          <div className="relative">
            <ArrowDown className="h-5 w-5" />
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDown className="h-5 w-5 text-neon-cyan/30" />
            </motion.div>
          </div>
        </motion.button>
      </motion.div>
    </section>
  )
}
