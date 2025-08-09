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
    post.featured ? 1 : 0,
    post.published ? 1 : 0,
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

// Simple sample posts without complex markdown
const samplePosts = [
  {
    slug: 'building-modern-web-apps-nextjs-15',
    title: 'Building Modern Web Applications with Next.js 15',
    description: 'A comprehensive guide to building scalable and performant web applications using Next.js 15 with the App Router, TypeScript, and modern development practices.',
    content: '# Building Modern Web Applications with Next.js 15\n\nThe web development landscape continues to evolve rapidly, and staying current with modern frameworks and best practices is crucial for building exceptional user experiences. In this post, I will walk you through the key concepts and features that make Next.js 15 an excellent choice for modern web applications.\n\n## Why Next.js 15?\n\nNext.js 15 introduces several groundbreaking features that make it the go-to framework for React applications.\n\n### App Router (Stable)\n\nThe App Router provides a new paradigm for organizing your application with enhanced routing capabilities.\n\n### Server Components by Default\n\nServer Components reduce the JavaScript bundle size and improve performance.\n\n## Key Features and Best Practices\n\n### 1. TypeScript Integration\n\nTypeScript provides excellent developer experience with static type checking.\n\n### 2. Automatic Optimizations\n\nNext.js 15 includes automatic optimizations:\n\n- Image Optimization: Automatic image resizing and format selection\n- Font Optimization: Automatic font subsetting and preloading\n- Bundle Optimization: Tree shaking and code splitting\n\n### 3. Streaming and Suspense\n\nImprove perceived performance with streaming.\n\n## Conclusion\n\nNext.js 15 provides a robust foundation for building modern web applications. By leveraging its built-in optimizations, TypeScript integration, and new App Router, you can create fast, scalable, and maintainable applications.',
    featured: true,
    published: true,
    published_at: '2024-12-15T10:00:00Z',
    reading_time: 8,
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop',
    author: 'Claude',
    tags: ['Next.js', 'React', 'TypeScript', 'Web Development']
  },
  {
    slug: 'mastering-typescript-advanced-patterns',
    title: 'Mastering TypeScript: Advanced Patterns and Best Practices',
    description: 'Dive deep into advanced TypeScript patterns, generics, conditional types, and best practices for building type-safe applications.',
    content: '# Mastering TypeScript: Advanced Patterns and Best Practices\n\nTypeScript has revolutionized the way we write JavaScript, bringing static type checking and enhanced developer experience to our projects. In this comprehensive guide, we will explore advanced TypeScript patterns that will help you write more robust and maintainable code.\n\n## Advanced Type Patterns\n\n### Generic Constraints\n\nGeneric constraints allow you to restrict the types that can be passed to a generic function or class.\n\n### Conditional Types\n\nConditional types enable type-level logic.\n\n### Mapped Types\n\nTransform existing types into new ones.\n\n## Utility Types in Action\n\n### Pick and Omit\n\nUse Pick and Omit to create subset types from existing interfaces.\n\n### Record Type\n\nCreate object types with known keys.\n\n## Best Practices\n\n1. Use Strict Configuration\n2. Prefer Type Annotations\n3. Use Discriminated Unions\n\n## Conclusion\n\nMastering these advanced TypeScript patterns will significantly improve your code quality and developer experience.',
    featured: false,
    published: true,
    published_at: '2024-12-10T14:30:00Z',
    reading_time: 12,
    author: 'Claude',
    tags: ['TypeScript', 'JavaScript', 'Programming', 'Best Practices']
  },
  {
    slug: 'art-of-code-review',
    title: 'The Art of Code Review: Building Better Software Together',
    description: 'Learn how to conduct effective code reviews that improve code quality, share knowledge, and build stronger development teams.',
    content: '# The Art of Code Review: Building Better Software Together\n\nCode review is one of the most important practices in software development, yet it is often done poorly or skipped entirely. A well-executed code review process can dramatically improve code quality, catch bugs early, and foster team collaboration.\n\n## Why Code Reviews Matter\n\n### Quality Assurance\n- Catch bugs before they reach production\n- Ensure adherence to coding standards\n- Identify potential security vulnerabilities\n- Verify that requirements are properly implemented\n\n### Knowledge Sharing\n- Spread domain knowledge across the team\n- Share best practices and techniques\n- Onboard new team members effectively\n- Cross-pollinate ideas between developers\n\n### Team Building\n- Foster collaboration and communication\n- Build trust and mutual respect\n- Create learning opportunities\n- Establish shared ownership of the codebase\n\n## Best Practices for Reviewers\n\n### 1. Review Early and Often\n\nReview smaller, focused changes rather than massive pull requests.\n\n### 2. Focus on the Important Things\n\nPrioritize logic errors, security issues, and architectural concerns over formatting.\n\n### 3. Be Constructive and Specific\n\nProvide actionable feedback with examples and suggestions.\n\n## Conclusion\n\nEffective code reviews are an art that requires practice, empathy, and clear communication. When done well, they become one of the most valuable practices in your development process.',
    featured: false,
    published: true,
    published_at: '2024-12-05T09:15:00Z',
    reading_time: 6,
    author: 'Claude',
    tags: ['Code Review', 'Software Engineering', 'Team Collaboration', 'Best Practices']
  }
]

// Function to seed the database
async function seedBlog() {
  console.log('🌱 Seeding blog database...')
  
  try {
    for (const post of samplePosts) {
      console.log(`Creating post: ${post.title}`)
      
      const postId = createPost(post)
      
      console.log(`✅ Created post with ID: ${postId}`)
    }
    
    console.log('🎉 Blog database seeded successfully!')
    
    // Print summary
    const allPostsStmt = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC')
    const publishedPostsStmt = db.prepare('SELECT * FROM blog_posts WHERE published = TRUE ORDER BY published_at DESC, created_at DESC')
    const featuredPostsStmt = db.prepare('SELECT * FROM blog_posts WHERE published = TRUE AND featured = TRUE ORDER BY published_at DESC, created_at DESC LIMIT 3')
    const allTagsStmt = db.prepare('SELECT * FROM blog_tags ORDER BY name')
    
    const allPosts = allPostsStmt.all()
    const publishedPosts = publishedPostsStmt.all()
    const featuredPosts = featuredPostsStmt.all()
    const allTags = allTagsStmt.all()
    
    console.log(`\n📊 Summary:`)
    console.log(`Total posts: ${allPosts.length}`)
    console.log(`Published posts: ${publishedPosts.length}`)
    console.log(`Featured posts: ${featuredPosts.length}`)
    console.log(`Total tags: ${allTags.length}`)
    
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
