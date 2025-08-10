'use client'

import { lazy, Suspense } from 'react'
import { LoadingSpinner, CardSkeleton } from './LoadingSpinner'

// Lazy load heavy components
export const LazyContactForm = lazy(() => 
  import('./ContactForm').then(module => ({ default: module.ContactForm }))
)

export const LazyProjects = lazy(() => 
  import('./Projects').then(module => ({ default: module.Projects }))
)

export const LazyBlogIndexClient = lazy(() => 
  import('./BlogIndexClient').then(module => ({ default: module.BlogIndexClient }))
)

// Wrapper components with suspense
export function ContactFormWithSuspense() {
  return (
    <Suspense fallback={
      <div className="section-padding">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="card p-8">
              <div className="space-y-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-bg-secondary rounded mb-4"></div>
                  <div className="h-4 bg-bg-secondary rounded mb-8"></div>
                  <div className="space-y-4">
                    <div className="h-12 bg-bg-secondary rounded"></div>
                    <div className="h-12 bg-bg-secondary rounded"></div>
                    <div className="h-12 bg-bg-secondary rounded"></div>
                    <div className="h-32 bg-bg-secondary rounded"></div>
                    <div className="h-12 bg-accent/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <LazyContactForm />
    </Suspense>
  )
}

export function ProjectsWithSuspense() {
  return (
    <Suspense fallback={
      <div className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-10 bg-bg-secondary rounded mb-4 max-w-md mx-auto"></div>
              <div className="h-6 bg-bg-secondary rounded max-w-2xl mx-auto"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    }>
      <LazyProjects />
    </Suspense>
  )
}

export function BlogIndexWithSuspense() {
  return (
    <Suspense fallback={
      <div className="section-padding bg-bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-10 bg-bg-secondary rounded mb-4 max-w-md mx-auto"></div>
              <div className="h-6 bg-bg-secondary rounded max-w-2xl mx-auto"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-6 space-y-4">
                <div className="animate-pulse">
                  <div className="h-6 bg-bg-secondary rounded mb-2"></div>
                  <div className="h-4 bg-bg-secondary rounded mb-4"></div>
                  <div className="h-4 bg-bg-secondary rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <LazyBlogIndexClient posts={[]} />
    </Suspense>
  )
}