'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Check, AlertCircle, User, Mail, MessageSquare } from 'lucide-react'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        return undefined
      
      case 'email':
        if (!value.trim()) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return undefined
      
      case 'subject':
        if (!value.trim()) return 'Subject is required'
        if (value.trim().length < 3) return 'Subject must be at least 3 characters'
        return undefined
      
      case 'message':
        if (!value.trim()) return 'Message is required'
        if (value.trim().length < 10) return 'Message must be at least 10 characters'
        return undefined
      
      default:
        return undefined
    }
  }

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (name: keyof FormData) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, formData[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      const error = validateField(key as keyof FormData, formData[key as keyof FormData])
      if (error) {
        newErrors[key as keyof FormErrors] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true
    })

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setStatus('loading')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would send the data to your API
      console.log('Form submitted:', formData)
      
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTouched({})
      setErrors({})
      
      // Reset success status after 3 seconds
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const getInputIcon = (fieldName: keyof FormData) => {
    switch (fieldName) {
      case 'name': return User
      case 'email': return Mail
      case 'subject': return MessageSquare
      case 'message': return MessageSquare
      default: return User
    }
  }

  return (
    <section id="contact" className="section-padding">
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
              Let's Work Together
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="body-large max-w-2xl mx-auto"
            >
              Have a project in mind? Let's discuss how we can bring your ideas to life.
            </motion.p>
          </div>

          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="card p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-text">
                    Name *
                  </label>
                  <div className="relative" suppressHydrationWarning>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-text-secondary" />
                    </div>
                    <motion.input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      whileFocus={{ 
                        boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.2)",
                        borderColor: "rgb(6, 182, 212)"
                      }}
                      className={`w-full pl-10 pr-4 py-3 bg-bg-secondary border rounded-lg text-text placeholder-text-secondary focus:outline-none focus:border-accent transition-all duration-300 ${
                        errors.name && touched.name 
                          ? 'border-red-500' 
                          : 'border-border hover:border-accent/50'
                      }`}
                      placeholder="Your full name"
                      suppressHydrationWarning
                    />
                  </div>
                  <AnimatePresence>
                    {errors.name && touched.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="flex items-center space-x-2 text-red-400 text-sm"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.name}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-text">
                    Email *
                  </label>
                  <div className="relative" suppressHydrationWarning>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-text-secondary" />
                    </div>
                    <motion.input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      whileFocus={{ 
                        boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.2)",
                        borderColor: "rgb(6, 182, 212)"
                      }}
                      className={`w-full pl-10 pr-4 py-3 bg-bg-secondary border rounded-lg text-text placeholder-text-secondary focus:outline-none focus:border-accent transition-all duration-300 ${
                        errors.email && touched.email 
                          ? 'border-red-500' 
                          : 'border-border hover:border-accent/50'
                      }`}
                      placeholder="your.email@example.com"
                      suppressHydrationWarning
                    />
                  </div>
                  <AnimatePresence>
                    {errors.email && touched.email && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="flex items-center space-x-2 text-red-400 text-sm"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.email}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-text">
                    Subject *
                  </label>
                  <div className="relative" suppressHydrationWarning>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-text-secondary" />
                    </div>
                    <motion.input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      onBlur={() => handleBlur('subject')}
                      whileFocus={{ 
                        boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.2)",
                        borderColor: "rgb(6, 182, 212)"
                      }}
                      className={`w-full pl-10 pr-4 py-3 bg-bg-secondary border rounded-lg text-text placeholder-text-secondary focus:outline-none focus:border-accent transition-all duration-300 ${
                        errors.subject && touched.subject 
                          ? 'border-red-500' 
                          : 'border-border hover:border-accent/50'
                      }`}
                      placeholder="What's this about?"
                      suppressHydrationWarning
                    />
                  </div>
                  <AnimatePresence>
                    {errors.subject && touched.subject && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="flex items-center space-x-2 text-red-400 text-sm"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.subject}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-text">
                    Message *
                  </label>
                  <motion.textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    onBlur={() => handleBlur('message')}
                    whileFocus={{ 
                      boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.2)",
                      borderColor: "rgb(6, 182, 212)"
                    }}
                    className={`w-full px-4 py-3 bg-bg-secondary border rounded-lg text-text placeholder-text-secondary focus:outline-none focus:border-accent transition-all duration-300 resize-none ${
                      errors.message && touched.message 
                        ? 'border-red-500' 
                        : 'border-border hover:border-accent/50'
                    }`}
                    placeholder="Tell me about your project..."
                    suppressHydrationWarning
                  />
                  <AnimatePresence>
                    {errors.message && touched.message && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="flex items-center space-x-2 text-red-400 text-sm"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.message}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Character Count */}
                  <div className="text-right">
                    <motion.span 
                      className="text-xs text-text-secondary"
                      animate={{
                        color: formData.message.length < 10 ? 'rgb(239 68 68)' : 'rgb(161 161 170)'
                      }}
                    >
                      {formData.message.length} / 500
                    </motion.span>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  whileHover={{ 
                    scale: status === 'loading' ? 1 : 1.02,
                    boxShadow: status === 'loading' ? undefined : "0 0 25px rgba(6, 182, 212, 0.4)"
                  }}
                  whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
                  className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    status === 'success'
                      ? 'bg-green-600 text-white'
                      : status === 'error'
                      ? 'bg-red-600 text-white'
                      : status === 'loading'
                      ? 'bg-accent/50 text-bg cursor-not-allowed'
                      : 'bg-accent text-bg hover:bg-accent-hover'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {status === 'loading' && (
                      <motion.div
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={{ opacity: 1, rotate: 360 }}
                        exit={{ opacity: 0 }}
                        transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}
                        className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    )}
                    
                    {status === 'success' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="h-5 w-5" />
                      </motion.div>
                    )}
                    
                    {status === 'error' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <AlertCircle className="h-5 w-5" />
                      </motion.div>
                    )}
                    
                    {status === 'idle' && (
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                      >
                        <Send className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <span>
                    {status === 'loading' && 'Sending...'}
                    {status === 'success' && 'Message Sent!'}
                    {status === 'error' && 'Failed to Send'}
                    {status === 'idle' && 'Send Message'}
                  </span>
                </motion.button>

                {/* Status Messages */}
                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                    >
                      <p className="text-green-400">
                        Thank you for your message! I'll get back to you soon.
                      </p>
                    </motion.div>
                  )}
                  
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                    >
                      <p className="text-red-400">
                        Sorry, there was an error sending your message. Please try again.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}