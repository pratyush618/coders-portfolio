import { formatDate, slugify, cn } from '@/lib/utils'

describe('Utils', () => {
  describe('formatDate', () => {
    it('formats date strings correctly', () => {
      const date = '2024-01-15'
      const formatted = formatDate(date)
      expect(formatted).toBe('January 15, 2024')
    })

    it('formats Date objects correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toBe('January 15, 2024')
    })

    it('formats timestamps correctly', () => {
      const timestamp = new Date('2024-01-15').getTime()
      const formatted = formatDate(timestamp)
      expect(formatted).toBe('January 15, 2024')
    })
  })

  describe('slugify', () => {
    it('converts strings to slugs correctly', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('This is a Test!')).toBe('this-is-a-test')
      expect(slugify('Multiple   Spaces')).toBe('multiple-spaces')
      expect(slugify('Special@#$Characters')).toBe('specialcharacters')
    })

    it('handles empty strings', () => {
      expect(slugify('')).toBe('')
    })

    it('removes leading and trailing dashes', () => {
      expect(slugify('-test-')).toBe('test')
      expect(slugify('--test--')).toBe('test')
    })

    it('handles multiple consecutive dashes', () => {
      expect(slugify('test---case')).toBe('test-case')
    })
  })

  describe('cn (className utility)', () => {
    it('combines class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('handles conditional classes', () => {
      expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2')
    })

    it('handles undefined and null values', () => {
      expect(cn('class1', null, undefined, 'class2')).toBe('class1 class2')
    })

    it('merges Tailwind classes correctly', () => {
      // This tests the underlying tailwind-merge functionality
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
      expect(cn('p-4', 'px-6')).toBe('p-4 px-6')
    })
  })
})
