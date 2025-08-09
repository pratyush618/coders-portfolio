import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'
import { siteConfig } from '@/lib/siteConfig'

export default function sitemap(): MetadataRoute.Sitemap {
  const allPosts = getAllPosts()
  const posts = allPosts.map(post => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...posts,
  ]
}
