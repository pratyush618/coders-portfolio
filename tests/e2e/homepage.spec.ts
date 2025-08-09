import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage and display hero section', async ({ page }) => {
    await page.goto('/')
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Claude Portfolio/)
    
    // Check hero section
    await expect(page.getByRole('heading', { name: 'Claude' })).toBeVisible()
    await expect(page.getByText('AI Assistant & Full-Stack Developer')).toBeVisible()
    
    // Check navigation
    await expect(page.getByRole('button', { name: 'About' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Experience' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Projects' })).toBeVisible()
    
    // Check that sections are present
    await expect(page.locator('#about')).toBeVisible()
    await expect(page.locator('#experience')).toBeVisible()
    await expect(page.locator('#projects')).toBeVisible()
    await expect(page.locator('#skills')).toBeVisible()
    await expect(page.locator('#blog')).toBeVisible()
    await expect(page.locator('#contact')).toBeVisible()
  })

  test('should navigate to sections when clicking navigation links', async ({ page }) => {
    await page.goto('/')
    
    // Click on About navigation
    await page.getByRole('button', { name: 'About' }).click()
    
    // Wait for smooth scroll to complete
    await page.waitForTimeout(1000)
    
    // Check that we're near the about section
    const aboutSection = page.locator('#about')
    await expect(aboutSection).toBeInViewport()
  })

  test('should have working social links', async ({ page }) => {
    await page.goto('/')
    
    // Check that social links are present and have correct attributes
    const githubLink = page.getByLabel('Follow on github')
    await expect(githubLink).toBeVisible()
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/anthropic')
    await expect(githubLink).toHaveAttribute('target', '_blank')
  })

  test('should display projects section with project cards', async ({ page }) => {
    await page.goto('/')
    
    // Scroll to projects section
    await page.locator('#projects').scrollIntoViewIfNeeded()
    
    // Check projects heading
    await expect(page.getByRole('heading', { name: 'Featured Projects' })).toBeVisible()
    
    // Check that at least one project card is visible
    await expect(page.locator('[data-testid="project-card"]').first()).toBeVisible()
  })

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check that mobile menu button is visible
    await expect(page.getByLabel('Toggle mobile menu')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.reload()
    
    // Check that desktop navigation is visible
    await expect(page.getByRole('button', { name: 'About' })).toBeVisible()
  })

  test('should pass basic accessibility checks', async ({ page }) => {
    await page.goto('/')
    
    // Check that page has proper headings structure
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
    
    // Check that images have alt text
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).toBeDefined()
    }
    
    // Check that buttons have accessible names
    const buttons = page.getByRole('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)
      const accessibleName = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')
      
      expect(accessibleName || ariaLabel).toBeTruthy()
    }
  })
})
