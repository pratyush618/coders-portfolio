'use client'

import { siteConfig } from '@/lib/siteConfig'

interface StructuredDataProps {
  data: Record<string, any>
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  )
}

// Person Schema for the portfolio owner
export function PersonStructuredData() {
  const personData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    jobTitle: siteConfig.author.role,
    description: siteConfig.author.bio,
    url: siteConfig.url,
    image: siteConfig.author.avatar,
    email: siteConfig.author.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.author.location
    },
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter
    ],
    alumniOf: siteConfig.education.map(edu => ({
      '@type': 'EducationalOrganization',
      name: edu.institution,
      description: `${edu.degree} in ${edu.field}`
    })),
    worksFor: siteConfig.experience.map(exp => ({
      '@type': 'Organization',
      name: exp.company,
      description: exp.description
    })),
    knowsAbout: [
      ...Object.values(siteConfig.skills).flat(),
      'Web Development',
      'Software Engineering',
      'Frontend Development',
      'Backend Development'
    ]
  }

  return <StructuredData data={personData} />
}

// Website Schema
export function WebSiteStructuredData() {
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/blog?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    mainEntity: {
      '@type': 'Person',
      name: siteConfig.author.name
    }
  }

  return <StructuredData data={websiteData} />
}

// Portfolio/CreativeWork Schema
export function PortfolioStructuredData() {
  const portfolioData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${siteConfig.author.name} - Portfolio`,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      jobTitle: siteConfig.author.role,
      url: siteConfig.url
    },
    dateCreated: new Date().getFullYear().toString(),
    workExample: siteConfig.projects.map(project => ({
      '@type': 'SoftwareApplication',
      name: project.title,
      description: project.description,
      url: project.liveUrl || project.githubUrl,
      applicationCategory: 'Web Application',
      operatingSystem: 'Web Browser',
      programmingLanguage: project.technologies,
      author: {
        '@type': 'Person',
        name: siteConfig.author.name
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    }))
  }

  return <StructuredData data={portfolioData} />
}

// Organization Schema (if applicable)
export function OrganizationStructuredData() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: siteConfig.ogImage,
    founder: {
      '@type': 'Person',
      name: siteConfig.author.name
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: siteConfig.author.email,
      contactType: 'Professional Inquiries'
    },
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter
    ]
  }

  return <StructuredData data={organizationData} />
}

// Blog Schema for individual blog posts
interface BlogPostStructuredDataProps {
  post: {
    title: string
    description?: string
    content: string
    slug: string
    published_at?: string
    created_at: string
    updated_at: string
    author: string
    reading_time?: number
    tags?: Array<{ name: string }>
    cover_image?: string
  }
}

export function BlogPostStructuredData({ post }: BlogPostStructuredDataProps) {
  const blogPostData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    articleBody: post.content.replace(/[#*`]/g, '').substring(0, 500) + '...',
    url: `${siteConfig.url}/blog/${post.slug}`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author || siteConfig.author.name,
      url: siteConfig.url
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: siteConfig.ogImage
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${post.slug}`
    },
    ...(post.cover_image && {
      image: {
        '@type': 'ImageObject',
        url: post.cover_image,
        width: 1200,
        height: 630
      }
    }),
    ...(post.reading_time && {
      timeRequired: `PT${post.reading_time}M`
    }),
    ...(post.tags && post.tags.length > 0 && {
      keywords: post.tags.map(tag => tag.name).join(', ')
    }),
    isPartOf: {
      '@type': 'Blog',
      name: `${siteConfig.name} Blog`,
      url: `${siteConfig.url}/blog`
    }
  }

  return <StructuredData data={blogPostData} />
}

// Blog Section Schema
export function BlogSectionStructuredData() {
  const blogSectionData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${siteConfig.name} Blog`,
    description: 'Technical articles, tutorials, and insights about web development and software engineering',
    url: `${siteConfig.url}/blog`,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: siteConfig.ogImage
      }
    },
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url
    }
  }

  return <StructuredData data={blogSectionData} />
}
