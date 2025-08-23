'use client'

import { useEffect, useRef, useState } from 'react'

interface SimpleMermaidProps {
  chart: string
  title?: string
}

export function SimpleMermaid({ chart, title }: SimpleMermaidProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const renderMermaid = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const mermaid = (await import('mermaid')).default
        
        mermaid.initialize({
          theme: 'dark',
          startOnLoad: false,
          securityLevel: 'loose',
          themeVariables: {
            primaryColor: '#06b6d4',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#27272a',
            lineColor: '#06b6d4',
            background: '#000000',
            mainBkg: '#111111',
            secondBkg: '#000000'
          }
        })

        if (ref.current) {
          ref.current.innerHTML = ''
          
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
          const { svg } = await mermaid.render(id, chart)
          ref.current.innerHTML = svg
          
          // Style the SVG
          const svgElement = ref.current.querySelector('svg')
          if (svgElement) {
            svgElement.style.maxWidth = '100%'
            svgElement.style.height = 'auto'
            svgElement.style.background = 'transparent'
          }
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : 'Failed to render diagram')
        setIsLoading(false)
      }
    }

    renderMermaid()
  }, [chart])

  if (error) {
    return (
      <div className="my-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
        <p className="text-red-400 text-sm">Error rendering diagram: {error}</p>
        <details className="mt-2">
          <summary className="text-red-300 cursor-pointer text-xs">Show diagram source</summary>
          <pre className="mt-2 p-2 bg-black rounded text-xs text-gray-300 overflow-x-auto">
            {chart}
          </pre>
        </details>
      </div>
    )
  }

  return (
    <div className="my-8">
      {title && (
        <div className="mb-4 p-3 bg-bg-secondary border-b border-border">
          <h4 className="text-text font-semibold">{title}</h4>
        </div>
      )}
      
      <div className="bg-bg-secondary border border-border rounded-lg overflow-hidden">
        <div className="p-6 bg-bg">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                <span className="text-text-secondary">Rendering diagram...</span>
              </div>
            </div>
          ) : (
            <div 
              ref={ref} 
              className="flex justify-center items-center min-h-[200px]"
            />
          )}
        </div>
      </div>
    </div>
  )
}