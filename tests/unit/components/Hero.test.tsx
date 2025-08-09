import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/Hero'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}))

// Mock utils
jest.mock('@/lib/utils', () => ({
  scrollToElement: jest.fn(),
}))

describe('Hero Component', () => {
  it('renders hero content correctly', () => {
    render(<Hero />)
    
    // Check that main elements are rendered
    expect(screen.getByText('Hello, I\'m')).toBeInTheDocument()
    expect(screen.getByText('Claude')).toBeInTheDocument()
    expect(screen.getByText('AI Assistant & Full-Stack Developer')).toBeInTheDocument()
    
    // Check description text
    expect(screen.getByText(/Specializing in modern web technologies/)).toBeInTheDocument()
  })

  it('renders call-to-action buttons', () => {
    render(<Hero />)
    
    expect(screen.getByText('Learn More About Me')).toBeInTheDocument()
    expect(screen.getByText('View My Work')).toBeInTheDocument()
  })

  it('renders social media links', () => {
    render(<Hero />)
    
    // Check that social links are present (aria-labels)
    expect(screen.getByLabelText('Follow on github')).toBeInTheDocument()
    expect(screen.getByLabelText('Follow on linkedin')).toBeInTheDocument()
    expect(screen.getByLabelText('Follow on twitter')).toBeInTheDocument()
    expect(screen.getByLabelText('Follow on email')).toBeInTheDocument()
  })

  it('renders scroll indicator', () => {
    render(<Hero />)
    
    expect(screen.getByLabelText('Scroll to content')).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(<Hero />)
    
    // Check that main heading is present
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Claude')
  })
})
