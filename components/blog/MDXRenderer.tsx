'use client'

import { useState, useEffect } from 'react'
import { Copy, Check } from 'lucide-react'

interface MDXRendererProps {
  content: string
}

export function MDXRenderer({ content }: MDXRendererProps) {
  const [processedContent, setProcessedContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processContent = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // For now, we'll render the raw MDX content as HTML
        // In a full implementation, you'd compile the MDX
        const htmlContent = content
          .replace(/^# (.*$)/gm, '<h1>$1</h1>')
          .replace(/^## (.*$)/gm, '<h2>$1</h2>')
          .replace(/^### (.*$)/gm, '<h3>$1</h3>')
          .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code>$1</code>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent hover:text-accent-hover">$1</a>')
          .replace(/\n\n/g, '</p><p>')
          .replace(/^(?!<[h1-6]|<ul|<ol|<li|<blockquote|<pre|<code)/gm, '<p>')
          .replace(/(?<!<\/[h1-6]>|<\/li>|<\/blockquote>|<\/pre>|<\/code>)$/gm, '</p>')
          // Handle code blocks
          .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre class="bg-bg-secondary border border-border rounded-lg p-4 overflow-x-auto my-6"><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`
          })
          // Handle line breaks
          .replace(/\n/g, '<br>')
        
        setProcessedContent(htmlContent)
      } catch (err) {
        setError('Failed to process content')
        console.error('MDX processing error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    processContent()
  }, [content])

  useEffect(() => {
    // Add copy functionality to code blocks after content is rendered
    const addCopyButtons = () => {
      const codeBlocks = document.querySelectorAll('pre code')
      codeBlocks.forEach((block) => {
        const pre = block.parentElement
        if (pre && !pre.querySelector('.copy-button')) {
          const button = document.createElement('button')
          button.className = 'copy-button absolute top-2 right-2 p-2 bg-bg-secondary border border-border rounded text-text-secondary hover:text-accent transition-colors'
          button.innerHTML = '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg>'
          
          button.onclick = async () => {
            try {
              await navigator.clipboard.writeText(block.textContent || '')
              button.innerHTML = '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
              setTimeout(() => {
                button.innerHTML = '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg>'
              }, 2000)
            } catch (err) {
              console.error('Failed to copy code:', err)
            }
          }
          
          pre.style.position = 'relative'
          pre.appendChild(button)
        }
      })
    }

    if (!isLoading && processedContent) {
      setTimeout(addCopyButtons, 100)
    }
  }, [isLoading, processedContent])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
        <p>Error loading content: {error}</p>
      </div>
    )
  }

  return (
    <div 
      className="mdx-content"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}
