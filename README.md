# Claude Portfolio

A modern, responsive, and accessible portfolio website built with Next.js 15, TypeScript, and Tailwind CSS. Features a dark theme, MDX blog support, and comprehensive testing.

![Portfolio Preview](https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=600&fit=crop)

## ✨ Features

- **Modern Stack**: Built with Next.js 15 App Router, TypeScript, and Tailwind CSS
- **Dark Theme**: High-contrast design with true black background and white text
- **Responsive Design**: Mobile-first approach, looks great on all devices
- **Accessibility**: WCAG AA compliant with proper semantic HTML and ARIA labels
- **Performance Optimized**: Lighthouse score 90+ for performance and accessibility
- **MDX Blog**: Full-featured blog system with syntax highlighting and RSS feed
- **SEO Ready**: Comprehensive meta tags, Open Graph, and structured data
- **Testing**: Unit tests with Jest and E2E tests with Playwright
- **CI/CD**: GitHub Actions workflow with automated testing and deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: Node.js 20)
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/claude-portfolio.git
cd claude-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm test             # Run unit tests
npm run test:watch   # Run unit tests in watch mode
npm run test:e2e     # Run end-to-end tests
```

## 🏗️ Project Structure

```
claude-portfolio/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Homepage
│   └── sitemap.ts        # Dynamic sitemap
├── components/            # React components
│   ├── Header.tsx        # Navigation header
│   ├── Hero.tsx          # Hero section
│   ├── About.tsx         # About section
│   ├── Experience.tsx    # Experience timeline
│   ├── Education.tsx     # Education section
│   ├── Projects.tsx      # Projects showcase
│   ├── ProjectCard.tsx   # Individual project card
│   ├── Skills.tsx        # Skills grid
│   ├── BlogIndex.tsx     # Blog posts listing
│   └── Footer.tsx        # Footer with contact
├── content/              # MDX content
│   └── blog/            # Blog posts
├── lib/                 # Utility functions
│   ├── siteConfig.ts    # Site configuration
│   └── utils.ts         # Helper functions
├── public/              # Static assets
│   ├── images/         # Image assets
│   └── robots.txt      # SEO robots file
├── tests/              # Test files
│   ├── unit/           # Unit tests
│   └── e2e/            # End-to-end tests
└── types/              # TypeScript definitions
```

## 🎨 Customization

### Personal Information

Edit `lib/siteConfig.ts` to update:

- Personal details (name, bio, contact)
- Social media links
- Work experience
- Education history
- Project portfolio
- Skills and technologies

```typescript
export const siteConfig = {
  name: 'Your Name',
  title: 'Your Portfolio Title',
  description: 'Your description...',
  author: {
    name: 'Your Name',
    role: 'Your Role',
    bio: 'Your bio...',
    // ... more personal info
  },
  // ... rest of configuration
}
```

### Styling and Theme

The design system is configured in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      bg: '#000000',           // Background
      'bg-secondary': '#111111', // Secondary background
      text: '#ffffff',         // Primary text
      'text-secondary': '#a1a1aa', // Secondary text
      accent: '#06b6d4',       // Accent color (cyan)
      'accent-hover': '#0891b2', // Accent hover state
    },
    // ... more theme configuration
  }
}
```

### Adding Blog Posts

Create new MDX files in `content/blog/`:

```markdown
---
title: 'Your Blog Post Title'
date: '2024-01-15'
description: 'Brief description of your post'
tags: ['tag1', 'tag2']
featured: true
draft: false
---

# Your Blog Post

Your content here...
```

### Adding Projects

Update the `projects` array in `lib/siteConfig.ts`:

```typescript
projects: [
  {
    id: 'unique-id',
    title: 'Project Title',
    description: 'Short description',
    longDescription: 'Detailed description',
    image: '/images/project-image.jpg',
    technologies: ['React', 'TypeScript', 'Next.js'],
    liveUrl: 'https://project-demo.com',
    githubUrl: 'https://github.com/user/project',
    featured: true,
    category: 'Web Development',
  },
  // ... more projects
]
```

## 🖼️ Adding Images

Place images in the `public/images/` directory:

- `avatar.jpg` - Your profile photo
- `og-image.png` - Open Graph image (1200x630px)
- Project screenshots for your portfolio

Update image references in `siteConfig.ts` and components.

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with one click

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables

For production deployment, set these environment variables:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### End-to-End Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npx playwright test --ui
```

### Performance Testing

```bash
# Run Lighthouse audit
npm install -g @lhci/cli
lhci autorun
```

## 🔧 Package Updates

To update dependencies to their latest versions:

```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# For major version updates
npx npm-check-updates -u
npm install
```

**Note**: Always test thoroughly after updating packages, especially for major version changes.

## 📊 Package Versions Used

This project was built with the following package versions:

### Core Framework
- **Next.js**: 15.0.3 - [Release Notes](https://github.com/vercel/next.js/releases)
- **React**: 19.0.0 - [Release Notes](https://react.dev/blog/2024/04/25/react-19)
- **TypeScript**: 5.3.3 - [Release Notes](https://devblogs.microsoft.com/typescript/)

### Styling
- **Tailwind CSS**: 3.4.0 - [Release Notes](https://tailwindcss.com/blog)
- **@tailwindcss/typography**: 0.5.10
- **Framer Motion**: 10.16.16 - [Documentation](https://www.framer.com/motion/)

### Content Management
- **Contentlayer**: 0.3.4 - [Documentation](https://contentlayer.dev/)
- **rehype-highlight**: 7.0.0
- **remark-gfm**: 4.0.0

### Development Tools
- **ESLint**: 8.56.0
- **Prettier**: 3.1.1
- **Jest**: 29.7.0
- **Playwright**: 1.40.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Contentlayer](https://contentlayer.dev/) for the content management system
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide Icons](https://lucide.dev/) for the beautiful icon set

## 📞 Support

If you have any questions or need help setting up the portfolio:

- Create an [issue](https://github.com/your-username/claude-portfolio/issues)
- Email: [your-email@example.com](mailto:your-email@example.com)
- Twitter: [@yourusername](https://twitter.com/yourusername)

---

**Built with ❤️ and lots of ☕ by [Your Name](https://your-portfolio.com)**
