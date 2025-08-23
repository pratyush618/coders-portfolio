import fs from 'fs'
import path from 'path'
import { blogDb } from './database'
import { extractMetaFromMdx, generateSlug, estimateReadingTime } from './mdx-utils'

export interface BlogPost {
  id: number | string
  slug: string
  title: string
  description?: string
  content: string
  featured: boolean
  published: boolean
  created_at: string
  updated_at: string
  published_at?: string
  reading_time: number
  cover_image?: string
  author: string
  tags: Array<{
    id: number | string
    name: string
    slug: string
    description?: string
    color: string
  }>
  source: 'database' | 'mdx'
}

const CONTENT_DIR = path.join(process.cwd(), 'content/blog')

async function getMdxPosts(): Promise<BlogPost[]> {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      return []
    }

    const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.mdx'))
    const posts: BlogPost[] = []

    for (const file of files) {
      const filePath = path.join(CONTENT_DIR, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { content, meta } = extractMetaFromMdx(fileContent)
      
      // Skip draft posts unless explicitly included
      if (meta.draft === true) {
        continue
      }

      const slug = meta.slug || generateSlug(meta.title || path.basename(file, '.mdx'))
      const reading_time = estimateReadingTime(content)
      
      // Parse tags from frontmatter
      let tags: BlogPost['tags'] = []
      if (meta.tags && Array.isArray(meta.tags)) {
        tags = meta.tags.map((tag: string, index: number) => ({
          id: `mdx-tag-${index}`,
          name: tag,
          slug: generateSlug(tag),
          color: '#06b6d4'
        }))
      }

      const post: BlogPost = {
        id: `mdx-${slug}`,
        slug,
        title: meta.title || 'Untitled',
        description: meta.description || '',
        content,
        featured: meta.featured === true,
        published: meta.draft !== true, // Published if not draft
        created_at: meta.date || new Date().toISOString(),
        updated_at: meta.date || new Date().toISOString(),
        published_at: meta.date || new Date().toISOString(),
        reading_time,
        cover_image: meta.cover_image || null,
        author: meta.author || 'Claude',
        tags,
        source: 'mdx'
      }

      posts.push(post)
    }

    return posts
  } catch (error) {
    console.error('Error loading MDX posts:', error)
    return []
  }
}

async function getDatabasePosts(): Promise<BlogPost[]> {
  try {
    const posts = await blogDb.getAllPosts()
    return posts.map(post => ({
      ...post,
      tags: post.tags || [], // Ensure tags is always an array
      source: 'database' as const
    }))
  } catch (error) {
    console.error('Error loading database posts:', error)
    return []
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const [dbPosts, mdxPosts] = await Promise.all([
    getDatabasePosts(),
    getMdxPosts()
  ])

  // Combine and sort by date (newest first)
  const allPosts = [...dbPosts, ...mdxPosts]
  
  return allPosts.sort((a, b) => {
    const dateA = new Date(a.published_at || a.created_at)
    const dateB = new Date(b.published_at || b.created_at)
    return dateB.getTime() - dateA.getTime()
  })
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => post.published)
}

export async function getFeaturedPosts(limit?: number): Promise<BlogPost[]> {
  const publishedPosts = await getPublishedPosts()
  const featured = publishedPosts.filter(post => post.featured)
  
  if (limit) {
    return featured.slice(0, limit)
  }
  
  return featured
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const allPosts = await getAllPosts()
  return allPosts.find(post => post.slug === slug) || null
}

export async function getAllTags(): Promise<BlogPost['tags']> {
  const allPosts = await getAllPosts()
  const tagMap = new Map<string, BlogPost['tags'][0]>()
  
  for (const post of allPosts) {
    // Check if tags exist and is iterable
    if (post.tags && Array.isArray(post.tags)) {
      for (const tag of post.tags) {
        if (!tagMap.has(tag.slug)) {
          tagMap.set(tag.slug, tag)
        }
      }
    }
  }
  
  return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name))
}