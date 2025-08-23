import { Metadata } from 'next'
import { getPublishedPosts, getFeaturedPosts, getAllTags } from '@/lib/blog-loader'
import { BlogListClient } from '@/components/blog/BlogListClient'
import { siteConfig } from '@/lib/siteConfig'
import { BlogSectionStructuredData } from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest posts about web development, technology, and coding insights.',
  openGraph: {
    title: 'Blog - Claude Portfolio',
    description: 'Latest posts about web development, technology, and coding insights.',
    url: `${siteConfig.url}/blog`,
  },
}

// Enable dynamic rendering to show new posts immediately
export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await getPublishedPosts()
  const featuredPosts = await getFeaturedPosts(3)
  const allTags = await getAllTags()

  return (
    <div className="min-h-screen bg-bg">
      {/* Structured Data for SEO */}
      <BlogSectionStructuredData />
      
      <BlogListClient 
        posts={posts}
        featuredPosts={featuredPosts}
        tags={allTags}
      />
    </div>
  )
}
