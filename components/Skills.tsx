'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Code, 
  Database, 
  Wrench, 
  Palette,
  Globe,
  Server,
  Smartphone,
  Zap,
  Terminal,
  Cpu,
  Binary
} from 'lucide-react'
import { siteConfig } from '@/lib/siteConfig'
import { HolographicCard } from './HolographicCard'
import { GlitchText } from './GlitchText'

const skillIcons = {
  'Frontend Development': Code,
  'Backend Development': Server,
  'Tools & Technologies': Wrench,
  'Design & UX': Palette,
  'Web Technologies': Globe,
  'Database': Database,
  'Mobile Development': Smartphone,
  'Performance': Zap,
}

export function Skills() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <section id="skills" className="section-padding bg-bg relative overflow-hidden">
      {/* Matrix Background Effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 bg-gradient-to-b from-transparent via-neon-green to-transparent"
              style={{
                left: `${(i * 5) + (i * 2)}%`,
                height: '200%',
              }}
              animate={{
                y: ['-100%', '100%'],
              }}
              transition={{
                duration: 3 + (i % 4),
                repeat: Infinity,
                delay: i * 0.2,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      <div className="container relative z-10">
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
              <GlitchText intensity="medium" trigger="hover">
                {'> NEURAL_CAPABILITIES.exe'}
              </GlitchText>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center justify-center space-x-2 mb-6"
            >
              <Terminal className="h-4 w-4 text-neon-green animate-pulse" />
              <span className="font-mono text-sm text-neon-green">
                <GlitchText intensity="low">INITIALIZING SKILL_MATRIX...</GlitchText>
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="body-large max-w-2xl mx-auto text-text-secondary"
            >
              Advanced technical capabilities powered by continuous learning algorithms
            </motion.p>
          </div>

          {/* Skills Matrix Display */}
          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(siteConfig.skills).map(([category, skills], index) => {
              const IconComponent = skillIcons[category as keyof typeof skillIcons] || Code

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                  onMouseEnter={() => setActiveCategory(category)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <div className="relative">
                    {/* Terminal-style container */}
                    <div className="bg-black border border-neon-green/30 rounded-lg overflow-hidden shadow-2xl">
                      {/* Terminal Header */}
                      <div className="flex items-center justify-between p-4 bg-bg-secondary border-b border-neon-green/20">
                        <div className="flex items-center space-x-3">
                          <motion.div 
                            className="p-2 bg-neon-green/10 rounded border border-neon-green/30"
                            whileHover={{ 
                              scale: 1.05,
                              boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)"
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <IconComponent className="h-5 w-5 text-neon-green" />
                          </motion.div>
                          <div>
                            <h3 className="font-mono text-sm text-neon-green">
                              <GlitchText intensity="low" trigger="hover">
                                {category.toUpperCase().replace(/\s+/g, '_')}
                              </GlitchText>
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
                              <span className="font-mono text-xs text-neon-green/70">
                                ACTIVE
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-neon-green rounded-full"></div>
                        </div>
                      </div>

                      {/* Terminal Content */}
                      <div className="p-6 bg-black min-h-[300px]">
                        <div className="space-y-3">
                          {/* Command prompt */}
                          <div className="flex items-center space-x-2 mb-4">
                            <span className="text-neon-green font-mono text-sm">{'>'}</span>
                            <motion.span 
                              className="font-mono text-sm text-neon-green"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                            >
                              ls -la ./skills/{category.toLowerCase().replace(/\s+/g, '_')}
                            </motion.span>
                          </div>

                          {/* Skills list in terminal style */}
                          <div className="space-y-2">
                            {skills.map((skill, skillIndex) => {
                              const proficiency = Math.min(85 + skillIndex * 2, 95)
                              const proficiencyLevel = proficiency > 90 ? 'EXPERT' : proficiency > 75 ? 'ADVANCED' : 'INTERMEDIATE'
                              const statusColor = proficiency > 90 ? 'text-neon-green' : proficiency > 75 ? 'text-neon-cyan' : 'text-yellow-400'
                              
                              return (
                                <motion.div
                                  key={skill}
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ 
                                    duration: 0.5, 
                                    delay: (index * 0.1) + (skillIndex * 0.08) + 0.5
                                  }}
                                  viewport={{ once: true }}
                                  className="flex items-center justify-between group/skill hover:bg-neon-green/5 p-2 rounded transition-colors"
                                >
                                  <div className="flex items-center space-x-3">
                                    <Binary className="h-3 w-3 text-neon-green/40" />
                                    <span className="font-mono text-sm text-white group-hover/skill:text-neon-green transition-colors">
                                      {skill}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <span className={`font-mono text-xs px-2 py-1 rounded border ${statusColor} border-current bg-current/10`}>
                                      {proficiencyLevel}
                                    </span>
                                    <motion.div 
                                      className="flex space-x-1"
                                      initial={{ opacity: 0 }}
                                      whileInView={{ opacity: 1 }}
                                      transition={{ delay: (index * 0.1) + (skillIndex * 0.08) + 0.8 }}
                                    >
                                      {[...Array(5)].map((_, i) => (
                                        <div
                                          key={i}
                                          className={`w-2 h-1 rounded-full ${
                                            i < Math.floor(proficiency / 20) 
                                              ? 'bg-neon-green animate-pulse' 
                                              : 'bg-neon-green/20'
                                          }`}
                                        />
                                      ))}
                                    </motion.div>
                                  </div>
                                </motion.div>
                              )
                            })}
                          </div>

                          {/* Terminal footer */}
                          <motion.div 
                            className="flex items-center space-x-2 mt-6 pt-4 border-t border-neon-green/20"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 1.5 }}
                            viewport={{ once: true }}
                          >
                            <span className="text-neon-green font-mono text-sm">{'>'}</span>
                            <span className="font-mono text-xs text-neon-green/70">
                              {skills.length} modules loaded | Status: OPERATIONAL
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Glowing effect when active */}
                    {activeCategory === category && (
                      <motion.div
                        className="absolute inset-0 border-2 border-neon-green rounded-lg pointer-events-none"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ 
                          opacity: [0.3, 0.7, 0.3],
                          scale: [0.98, 1, 0.98],
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{
                          boxShadow: '0 0 30px rgba(0, 255, 65, 0.3), inset 0 0 30px rgba(0, 255, 65, 0.1)'
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* System Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="bg-black border border-neon-green/30 rounded-lg overflow-hidden">
              {/* System Header */}
              <div className="p-4 bg-bg-secondary border-b border-neon-green/20">
                <div className="flex items-center space-x-3">
                  <Cpu className="h-5 w-5 text-neon-green animate-pulse" />
                  <h3 className="font-mono text-neon-green">
                    <GlitchText intensity="medium" trigger="hover">
                      SYSTEM_CORE_PRINCIPLES.exe
                    </GlitchText>
                  </h3>
                </div>
              </div>

              <div className="p-8">
                {/* System Description */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="mb-8 text-center"
                >
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className="text-neon-green font-mono text-sm">{'>'}</span>
                    <motion.span 
                      className="font-mono text-sm text-neon-green"
                      initial={{ width: 0 }}
                      whileInView={{ width: "auto" }}
                      transition={{ duration: 2, delay: 0.9 }}
                    >
                      cat ./core/philosophy.txt
                    </motion.span>
                  </div>
                  <p className="text-text-secondary max-w-3xl mx-auto">
                    Continuous evolution through adaptive learning algorithms. 
                    Committed to engineering excellence and user-centric innovation.
                  </p>
                </motion.div>

                {/* Core Principles Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: Code, title: "CLEAN_CODE", desc: "Maintainable, readable, efficient algorithms" },
                    { icon: Zap, title: "PERFORMANCE", desc: "Optimized execution and resource management" },
                    { icon: Globe, title: "ACCESSIBILITY", desc: "Universal design patterns and inclusive UX" },
                    { icon: Palette, title: "UX_FIRST", desc: "Human-centered interface architecture" }
                  ].map((principle, index) => (
                    <motion.div
                      key={principle.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1 + (index * 0.1) }}
                      viewport={{ once: true }}
                      className="group hover:bg-neon-green/5 p-4 rounded border border-neon-green/20 transition-all"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <motion.div
                          className="p-2 bg-neon-green/10 rounded border border-neon-green/30"
                          whileHover={{ 
                            scale: 1.1,
                            boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)"
                          }}
                        >
                          <principle.icon className="h-4 w-4 text-neon-green" />
                        </motion.div>
                        <h4 className="font-mono text-sm text-neon-green group-hover:text-white transition-colors">
                          <GlitchText intensity="low" trigger="hover">
                            {principle.title}
                          </GlitchText>
                        </h4>
                      </div>
                      <p className="text-xs text-text-secondary group-hover:text-text transition-colors">
                        {principle.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* System Status */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center space-x-2 mt-8 pt-6 border-t border-neon-green/20"
                >
                  <span className="text-neon-green font-mono text-sm">{'>'}</span>
                  <span className="font-mono text-xs text-neon-green/70">
                    System status: OPTIMAL | Learning mode: ACTIVE | Ready for deployment
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
