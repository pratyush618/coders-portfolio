import { getAllPosts } from '@/lib/mdx'
import { BlogIndexClient } from './BlogIndexClient'

export async function BlogIndex() {
  // Get the latest 3 posts (this runs on the server)
  const allPosts = getAllPosts()
  const latestPosts = allPosts.slice(0, 3)

  return <BlogIndexClient posts={latestPosts} />
}
