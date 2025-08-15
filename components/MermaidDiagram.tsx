'use client'

import { useEffect, useRef, useState } from 'react'
import { Copy, Check, Download, Maximize2 } from 'lucide-react'

interface MermaidDiagramProps {
  chart: string
  title?: string
}

export function MermaidDiagram({ chart, title }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const renderMermaid = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Dynamically import mermaid to avoid SSR issues
        const mermaid = await import('mermaid')
        
        // Configure mermaid for dark theme
        mermaid.default.initialize({
          theme: 'dark',
          themeVariables: {
            primaryColor: '#06b6d4',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#27272a',
            lineColor: '#06b6d4',
            sectionBkgColor: '#111111',
            altSectionBkgColor: '#000000',
            gridColor: '#27272a',
            secondaryColor: '#0891b2',
            tertiaryColor: '#164e63',
            background: '#000000',
            mainBkg: '#111111',
            secondBkg: '#000000',
            tertiaryBkg: '#1f1f23',
            // Node colors
            c0: '#06b6d4',
            c1: '#0891b2',
            c2: '#0e7490',
            c3: '#155e75',
            c4: '#164e63',
            // Text colors
            cScale0: '#ffffff',
            cScale1: '#e2e8f0',
            cScale2: '#cbd5e1',
            // Border colors
            cBorder: '#27272a',
            cEdgeLabelBackground: '#000000',
            cFillText: '#ffffff',
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
          },
          sequence: {
            actorMargin: 50,
            width: 150,
            height: 65,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
            mirrorActors: true,
            useMaxWidth: true
          },
          gantt: {
            useMaxWidth: true,
            barHeight: 20,
            fontSize: 11,
            sectionFontSize: 24,
            gridLineStartPadding: 35,
            bottomPadding: 25,
            leftPadding: 75,
            topPadding: 35,
            rightPadding: 35
          },
          pie: {
            useMaxWidth: true
          },
          journey: {
            useMaxWidth: true
          },
          timeline: {
            useMaxWidth: true
          },
          mindmap: {
            useMaxWidth: true
          },
          gitGraph: {
            useMaxWidth: true
          }
        })

        if (ref.current) {
          // Clear previous content
          ref.current.innerHTML = ''
          
          // Generate unique ID for this diagram
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
          
          // Render the diagram
          const { svg } = await mermaid.default.render(id, chart)
          ref.current.innerHTML = svg

          // Style the SVG for better integration
          const svgElement = ref.current.querySelector('svg')
          if (svgElement) {
            svgElement.style.maxWidth = '100%'
            svgElement.style.height = 'auto'
            svgElement.style.background = 'transparent'
            svgElement.style.color = '#ffffff'
          }
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : 'Failed to render diagram')
      } finally {
        setIsLoading(false)
      }
    }

    renderMermaid()
  }, [chart])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadSVG = () => {
    const svgElement = ref.current?.querySelector('svg')
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const blob = new Blob([svgData], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${title || 'mermaid-diagram'}.svg`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (error) {
    return (
      <div className="my-8 p-6 bg-bg-secondary border border-red-500/30 rounded-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
          </div>
          <h4 className="text-red-400 font-semibold">Mermaid Diagram Error</h4>
        </div>
        <p className="text-text-secondary text-sm mb-4">
          Failed to render the diagram. Please check the syntax:
        </p>
        <pre className="bg-bg border border-border rounded p-3 text-sm text-text-secondary overflow-x-auto">
          <code>{error}</code>
        </pre>
        <details className="mt-4">
          <summary className="text-accent cursor-pointer text-sm hover:text-accent/80">
            Show diagram source
          </summary>
          <pre className="mt-2 bg-bg border border-border rounded p-3 text-sm text-text-secondary overflow-x-auto">
            <code>{chart}</code>
          </pre>
        </details>
      </div>
    )
  }

  return (
    <>
      <div className="relative group my-8">
        <div className="bg-bg-secondary border border-border rounded-lg overflow-hidden">
          {title && (
            <div className="flex items-center justify-between px-4 py-3 bg-bg border-b border-border">
              <h4 className="text-text font-semibold">{title}</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(chart)}
                  className="flex items-center space-x-2 px-3 py-1 text-xs text-text-secondary hover:text-text bg-bg-secondary hover:bg-bg border border-border rounded transition-all opacity-0 group-hover:opacity-100"
                  title="Copy source"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={downloadSVG}
                  className="flex items-center space-x-2 px-3 py-1 text-xs text-text-secondary hover:text-text bg-bg-secondary hover:bg-bg border border-border rounded transition-all opacity-0 group-hover:opacity-100"
                  title="Download SVG"
                >
                  <Download className="h-3 w-3" />
                  <span>SVG</span>
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="flex items-center space-x-2 px-3 py-1 text-xs text-text-secondary hover:text-text bg-bg-secondary hover:bg-bg border border-border rounded transition-all opacity-0 group-hover:opacity-100"
                  title="View fullscreen"
                >
                  <Maximize2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
          
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
                className="mermaid-diagram flex justify-center items-center min-h-[200px]"
              />
            )}
          </div>

          {!title && (
            <div className="absolute top-3 right-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => copyToClipboard(chart)}
                className="p-2 bg-bg/80 border border-border rounded text-text-secondary hover:text-text hover:bg-bg transition-all"
                title="Copy source"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={downloadSVG}
                className="p-2 bg-bg/80 border border-border rounded text-text-secondary hover:text-text hover:bg-bg transition-all"
                title="Download SVG"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-bg/80 border border-border rounded text-text-secondary hover:text-text hover:bg-bg transition-all"
                title="View fullscreen"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-bg/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full h-full max-w-7xl max-h-full bg-bg-secondary border border-border rounded-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-bg border-b border-border">
              <h4 className="text-text font-semibold">{title || 'Mermaid Diagram'}</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={downloadSVG}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-text-secondary hover:text-text bg-bg-secondary hover:bg-bg border border-border rounded transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Download SVG</span>
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="px-4 py-2 text-sm text-text-secondary hover:text-text bg-bg-secondary hover:bg-bg border border-border rounded transition-all"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-auto bg-bg">
              <div 
                dangerouslySetInnerHTML={{ __html: ref.current?.innerHTML || '' }}
                className="flex justify-center items-center min-h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}