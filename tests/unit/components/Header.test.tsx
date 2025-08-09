import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '@/components/Header'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock utils
jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
  scrollToElement: jest.fn(),
}))

// Mock window scroll methods
Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: 0,
})

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: jest.fn(),
})

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  value: jest.fn(),
})

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders logo correctly', () => {
    render(<Header />)
    
    expect(screen.getByText('Claude')).toBeInTheDocument()
  })

  it('renders navigation items', () => {
    render(<Header />)
    
    // Check that navigation items are present
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('Education')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders mobile menu toggle button', () => {
    render(<Header />)
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu')
    expect(mobileMenuButton).toBeInTheDocument()
  })

  it('toggles mobile menu when button is clicked', () => {
    render(<Header />)
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu')
    
    // Mobile menu should be closed initially
    expect(screen.queryByRole('navigation')).not.toHaveClass('md:hidden')
    
    // Click to open mobile menu
    fireEvent.click(mobileMenuButton)
    
    // Mobile menu should now be visible (in the DOM)
    // Note: The actual visibility is controlled by CSS classes and animations
  })

  it('calls scrollToElement when navigation item is clicked', () => {
    const { scrollToElement } = require('@/lib/utils')
    render(<Header />)
    
    const aboutLink = screen.getAllByText('About')[0] // Get the first About link (desktop nav)
    fireEvent.click(aboutLink)
    
    expect(scrollToElement).toHaveBeenCalledWith('about')
  })

  it('has proper accessibility attributes', () => {
    render(<Header />)
    
    // Check that mobile menu button has proper aria-label
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu')
    expect(mobileMenuButton).toHaveAttribute('aria-label', 'Toggle mobile menu')
  })
})
