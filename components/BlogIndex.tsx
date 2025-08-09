import { blogDb } from '@/lib/database'
import { BlogIndexClient } from './BlogIndexClient'

export async function BlogIndex() {
  // Get the latest 3 featured posts (this runs on the server)
  const latestPosts = await blogDb.getFeaturedPosts(3)

  return <BlogIndexClient posts={latestPosts} />
}
