const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(process.cwd(), 'blog.db')
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Create tables
const createTables = () => {
  // Blog posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      content TEXT NOT NULL,
      featured BOOLEAN DEFAULT FALSE,
      published BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      published_at DATETIME,
      reading_time INTEGER,
      cover_image TEXT,
      author TEXT DEFAULT 'Claude'
    )
  `)

  // Blog tags table
  db.exec(`
    CREATE TABLE IF NOT EXISTS blog_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      color TEXT DEFAULT '#06b6d4'
    )
  `)

  // Blog post tags junction table
  db.exec(`
    CREATE TABLE IF NOT EXISTS blog_post_tags (
      post_id INTEGER,
      tag_id INTEGER,
      PRIMARY KEY (post_id, tag_id),
      FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES blog_tags(id) ON DELETE CASCADE
    )
  `)

  // Update trigger for updated_at
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_blog_posts_updated_at
    AFTER UPDATE ON blog_posts
    BEGIN
      UPDATE blog_posts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `)
}

// Initialize database
createTables()

// Utility functions
function estimateReadingTime(content) {
  const plainText = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
    .replace(/[#*_~`]/g, '') // Remove markdown formatting
    .trim()

  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length
  const wordsPerMinute = 200 // Average reading speed
  return Math.ceil(wordCount / wordsPerMinute)
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// Database operations
const createPost = (post) => {
  const stmt = db.prepare(`
    INSERT INTO blog_posts (
      slug, title, description, content, featured, published, 
      published_at, reading_time, cover_image, author
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  const result = stmt.run(
    post.slug,
    post.title,
    post.description || null,
    post.content,
    post.featured || false,
    post.published || false,
    post.published_at || null,
    post.reading_time || null,
    post.cover_image || null,
    post.author || 'Claude'
  )

  // Add tags if provided
  if (post.tags && post.tags.length > 0) {
    addTagsToPost(result.lastInsertRowid, post.tags)
  }

  return result.lastInsertRowid
}

const addTagsToPost = (postId, tagNames) => {
  const insertTagStmt = db.prepare(`
    INSERT OR IGNORE INTO blog_tags (name, slug) 
    VALUES (?, ?)
  `)
  const getTagStmt = db.prepare('SELECT id FROM blog_tags WHERE name = ?')
  const linkStmt = db.prepare(`
    INSERT OR IGNORE INTO blog_post_tags (post_id, tag_id) 
    VALUES (?, ?)
  `)

  for (const tagName of tagNames) {
    const slug = tagName.toLowerCase().replace(/\s+/g, '-')
    insertTagStmt.run(tagName, slug)
    const tag = getTagStmt.get(tagName)
    if (tag) {
      linkStmt.run(postId, tag.id)
    }
  }
}

const getAllPosts = () => {
  const stmt = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC')
  return stmt.all()
}

const getPublishedPosts = () => {
  const stmt = db.prepare(`
    SELECT * FROM blog_posts 
    WHERE published = TRUE 
    ORDER BY published_at DESC, created_at DESC
  `)
  return stmt.all()
}

const getFeaturedPosts = (limit = 3) => {
  const stmt = db.prepare(`
    SELECT * FROM blog_posts 
    WHERE published = TRUE AND featured = TRUE 
    ORDER BY published_at DESC, created_at DESC 
    LIMIT ?
  `)
  return stmt.all(limit)
}

const getAllTags = () => {
  const stmt = db.prepare('SELECT * FROM blog_tags ORDER BY name')
  return stmt.all()
}

// Sample posts
const samplePosts = [
  {
    title: 'Building Modern Web Applications with Next.js 15',
    description: 'A comprehensive guide to building scalable and performant web applications using Next.js 15 with the App Router, TypeScript, and modern development practices.',
    content: `# Building Modern Web Applications with Next.js 15

The web development landscape continues to evolve rapidly, and staying current with modern frameworks and best practices is crucial for building exceptional user experiences. In this post, I'll walk you through the key concepts and features that make Next.js 15 an excellent choice for modern web applications.

## Why Next.js 15?

Next.js 15 introduces several groundbreaking features that make it the go-to framework for React applications:

### App Router (Stable)

The App Router provides a new paradigm for organizing your application with enhanced routing capabilities:

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### Server Components by Default

Server Components reduce the JavaScript bundle size and improve performance:

```typescript
// This component runs on the server
async function BlogPosts() {
  const posts = await getPosts()
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
```

## Key Features and Best Practices

### 1. TypeScript Integration

TypeScript provides excellent developer experience with static type checking:

```typescript
interface Post {
  id: string
  title: string
  content: string
  publishedAt: Date
  tags: string[]
}

async function getPost(id: string): Promise<Post | null> {
  // Implementation
}
```

### 2. Automatic Optimizations

Next.js 15 includes automatic optimizations:

- **Image Optimization**: Automatic image resizing and format selection
- **Font Optimization**: Automatic font subsetting and preloading
- **Bundle Optimization**: Tree shaking and code splitting

### 3. Streaming and Suspense

Improve perceived performance with streaming:

```typescript
import { Suspense } from 'react'

function Page() {
  return (
    <div>
      <h1>My Blog</h1>
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>
    </div>
  )
}
```

## Performance Optimization Strategies

### Code Splitting

Leverage dynamic imports for better code splitting:

```typescript
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('../components/Heavy'), {
  loading: () => <p>Loading...</p>,
})
```

### Caching Strategies

Implement effective caching with the new caching APIs:

```typescript
import { cache } from 'react'

const getUser = cache(async (id: string) => {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
})
```

## Conclusion

Next.js 15 provides a robust foundation for building modern web applications. By leveraging its built-in optimizations, TypeScript integration, and new App Router, you can create fast, scalable, and maintainable applications.

The combination of Server Components, automatic optimizations, and excellent developer experience makes Next.js 15 an excellent choice for your next project.\`,
    featured: true,
    published: true,
    published_at: '2024-12-15T10:00:00Z',
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop',
    tags: ['Next.js', 'React', 'TypeScript', 'Web Development']
  },
  {
    title: 'Mastering TypeScript: Advanced Patterns and Best Practices',
    description: 'Dive deep into advanced TypeScript patterns, generics, conditional types, and best practices for building type-safe applications.',
    content: `# Mastering TypeScript: Advanced Patterns and Best Practices

TypeScript has revolutionized the way we write JavaScript, bringing static type checking and enhanced developer experience to our projects. In this comprehensive guide, we'll explore advanced TypeScript patterns that will help you write more robust and maintainable code.

## Advanced Type Patterns

### Generic Constraints

Generic constraints allow you to restrict the types that can be passed to a generic function or class:

```typescript
interface Lengthwise {
  length: number
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}

// Works with arrays, strings, etc.
loggingIdentity([1, 2, 3])
loggingIdentity("hello")
```

### Conditional Types

Conditional types enable type-level logic:

```typescript
type NonNullable<T> = T extends null | undefined ? never : T

type ApiResponse<T> = T extends string 
  ? { message: T } 
  : T extends number 
    ? { code: T } 
    : { data: T }

type StringResponse = ApiResponse<string> // { message: string }
type NumberResponse = ApiResponse<number> // { code: number }
```

## Conclusion

Mastering these advanced TypeScript patterns will significantly improve your code quality and developer experience. The key is to start with the basics and gradually incorporate more advanced patterns as your projects grow in complexity.\`,
    featured: false,
    published: true,
    published_at: '2024-12-10T14:30:00Z',
    tags: ['TypeScript', 'JavaScript', 'Programming', 'Best Practices']
  },
  {
    title: 'The Art of Code Review: Building Better Software Together',
    description: 'Learn how to conduct effective code reviews that improve code quality, share knowledge, and build stronger development teams.',
    content: `# The Art of Code Review: Building Better Software Together

Code review is one of the most important practices in software development, yet it's often done poorly or skipped entirely. A well-executed code review process can dramatically improve code quality, catch bugs early, and foster team collaboration.

## Why Code Reviews Matter

### Quality Assurance
- Catch bugs before they reach production
- Ensure adherence to coding standards
- Identify potential security vulnerabilities
- Verify that requirements are properly implemented

### Knowledge Sharing
- Spread domain knowledge across the team
- Share best practices and techniques
- Onboard new team members effectively
- Cross-pollinate ideas between developers

## Best Practices for Reviewers

### 1. Review Early and Often

```typescript
// Instead of reviewing this massive PR...
class UserService {
  // 500 lines of complex logic
}

// Review smaller, focused changes
class UserService {
  validateUser(user: User): ValidationResult {
    // 20 lines of focused logic
  }
}
```

### 2. Focus on the Important Things

**High Priority:**
- Logic errors and bugs
- Security vulnerabilities  
- Performance issues
- Architectural concerns

**Medium Priority:**
- Code style consistency
- Naming conventions
- Code organization

**Low Priority:**
- Formatting (use automated tools)
- Personal preferences

## Conclusion

Effective code reviews are an art that requires practice, empathy, and clear communication. When done well, they become one of the most valuable practices in your development process.\`,
    featured: false,
    published: true,
    published_at: '2024-12-05T09:15:00Z',
    tags: ['Code Review', 'Software Engineering', 'Team Collaboration', 'Best Practices']
  }
]

// Function to seed the database
async function seedBlog() {
  console.log('🌱 Seeding blog database...')
  
  try {
    for (const post of samplePosts) {
      const slug = generateSlug(post.title)
      const readingTime = estimateReadingTime(post.content)
      
      console.log(\`Creating post: \${post.title}\`)
      
      const postId = createPost({
        slug,
        title: post.title,
        description: post.description,
        content: post.content,
        featured: post.featured,
        published: post.published,
        published_at: post.published_at,
        reading_time: readingTime,
        cover_image: post.cover_image,
        author: 'Claude',
        tags: post.tags
      })
      
      console.log(\`✅ Created post with ID: \${postId}\`)
    }
    
    console.log('🎉 Blog database seeded successfully!')
    
    // Print summary
    const allPosts = getAllPosts()
    const publishedPosts = getPublishedPosts()
    const featuredPosts = getFeaturedPosts()
    const allTags = getAllTags()
    
    console.log(\`\\n📊 Summary:\`)
    console.log(\`Total posts: \${allPosts.length}\`)
    console.log(\`Published posts: \${publishedPosts.length}\`)
    console.log(\`Featured posts: \${featuredPosts.length}\`)
    console.log(\`Total tags: \${allTags.length}\`)
    
  } catch (error) {
    console.error('❌ Error seeding blog database:', error)
    throw error
  } finally {
    db.close()
  }
}

// Run the seeding
seedBlog()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
