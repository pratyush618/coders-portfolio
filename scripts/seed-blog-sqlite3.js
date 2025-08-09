const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const { promisify } = require('util')

const dbPath = path.join(process.cwd(), 'blog.db')
const db = new sqlite3.Database(dbPath)

// Promisify database methods
const dbRun = promisify(db.run.bind(db))
const dbGet = promisify(db.get.bind(db))
const dbAll = promisify(db.all.bind(db))

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON')

// Create tables
const createTables = async () => {
  // Blog posts table
  await dbRun(`
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
  await dbRun(`
    CREATE TABLE IF NOT EXISTS blog_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      color TEXT DEFAULT '#06b6d4'
    )
  `)

  // Blog post tags junction table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS blog_post_tags (
      post_id INTEGER,
      tag_id INTEGER,
      PRIMARY KEY (post_id, tag_id),
      FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES blog_tags(id) ON DELETE CASCADE
    )
  `)

  // Update trigger for updated_at
  await dbRun(`
    CREATE TRIGGER IF NOT EXISTS update_blog_posts_updated_at
    AFTER UPDATE ON blog_posts
    BEGIN
      UPDATE blog_posts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `)
}

// Database operations
const createPost = async (post) => {
  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO blog_posts (
        slug, title, description, content, featured, published, 
        published_at, reading_time, cover_image, author
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
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
    ], async function(err) {
      if (err) {
        reject(err)
        return
      }
      
      const postId = this.lastID
      
      // Add tags if provided
      if (post.tags && post.tags.length > 0) {
        try {
          await addTagsToPost(postId, post.tags)
        } catch (error) {
          reject(error)
          return
        }
      }
      
      resolve(postId)
    })
  })
}

const addTagsToPost = async (postId, tagNames) => {
  for (const tagName of tagNames) {
    const slug = tagName.toLowerCase().replace(/\s+/g, '-')
    
    // Insert tag if it doesn't exist
    await dbRun(`
      INSERT OR IGNORE INTO blog_tags (name, slug) 
      VALUES (?, ?)
    `, [tagName, slug])
    
    // Get tag ID
    const tag = await dbGet('SELECT id FROM blog_tags WHERE name = ?', [tagName])
    
    if (tag) {
      // Link post to tag
      await dbRun(`
        INSERT OR IGNORE INTO blog_post_tags (post_id, tag_id) 
        VALUES (?, ?)
      `, [postId, tag.id])
    }
  }
}

// Simple sample posts
const samplePosts = [
  {
    slug: 'building-modern-web-apps-nextjs-15',
    title: 'Building Modern Web Applications with Next.js 15',
    description: 'A comprehensive guide to building scalable and performant web applications using Next.js 15 with the App Router, TypeScript, and modern development practices.',
    content: `# Building Modern Web Applications with Next.js 15

The web development landscape continues to evolve rapidly, and staying current with modern frameworks and best practices is crucial for building exceptional user experiences. In this post, I will walk you through the key concepts and features that make Next.js 15 an excellent choice for modern web applications.

## Why Next.js 15?

Next.js 15 introduces several groundbreaking features that make it the go-to framework for React applications.

### App Router (Stable)

The App Router provides a new paradigm for organizing your application with enhanced routing capabilities.

### Server Components by Default

Server Components reduce the JavaScript bundle size and improve performance.

## Key Features and Best Practices

### 1. TypeScript Integration

TypeScript provides excellent developer experience with static type checking.

### 2. Automatic Optimizations

Next.js 15 includes automatic optimizations:

- **Image Optimization**: Automatic image resizing and format selection
- **Font Optimization**: Automatic font subsetting and preloading
- **Bundle Optimization**: Tree shaking and code splitting

### 3. Streaming and Suspense

Improve perceived performance with streaming.

## Performance Optimization Strategies

### Code Splitting

Leverage dynamic imports for better code splitting.

### Caching Strategies

Implement effective caching with the new caching APIs.

## SEO and Accessibility

### Metadata API

The new Metadata API makes SEO configuration simple.

### Accessibility Best Practices

Always ensure your applications are accessible:

- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation works
- Maintain proper color contrast

## Testing Strategy

A comprehensive testing strategy includes unit tests with Jest and end-to-end tests with Playwright.

## Deployment and CI/CD

### Vercel Integration

Deploying Next.js applications to Vercel is seamless.

### GitHub Actions

Set up continuous integration for automated testing and deployment.

## Conclusion

Next.js 15 provides a robust foundation for building modern web applications. By leveraging its built-in optimizations, TypeScript integration, and new App Router, you can create fast, scalable, and maintainable applications.

The combination of Server Components, automatic optimizations, and excellent developer experience makes Next.js 15 an excellent choice for your next project.`,
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
    content: `# Mastering TypeScript: Advanced Patterns and Best Practices

TypeScript has revolutionized the way we write JavaScript, bringing static type checking and enhanced developer experience to our projects. In this comprehensive guide, we will explore advanced TypeScript patterns that will help you write more robust and maintainable code.

## Advanced Type Patterns

### Generic Constraints

Generic constraints allow you to restrict the types that can be passed to a generic function or class.

### Conditional Types

Conditional types enable type-level logic.

### Mapped Types

Transform existing types into new ones.

## Utility Types in Action

### Pick and Omit

Use Pick and Omit to create subset types from existing interfaces.

### Record Type

Create object types with known keys.

## Advanced Function Types

### Function Overloads

Function overloads allow you to define multiple function signatures.

### Higher-Order Function Types

Higher-order functions work with other functions as parameters or return values.

## Type Guards and Assertions

### Custom Type Guards

Custom type guards help TypeScript understand your data types at runtime.

### Assertion Functions

Assertion functions provide guarantees about the types of values.

## Module Patterns

### Namespace Organization

Organize related functionality using namespaces.

### Declaration Merging

Declaration merging allows you to extend existing types.

## Best Practices

1. **Use Strict Configuration**: Enable strict mode for better type safety
2. **Prefer Type Annotations**: Be explicit about types when needed
3. **Use Discriminated Unions**: Create robust data models

## Performance Considerations

### Avoid Deep Nesting

Keep type definitions shallow for better compilation performance.

### Use Type Aliases Wisely

Create reusable type definitions for complex types.

## Conclusion

Mastering these advanced TypeScript patterns will significantly improve your code quality and developer experience. The key is to start with the basics and gradually incorporate more advanced patterns as your projects grow in complexity.

Remember that TypeScript's type system is incredibly powerful, but it should enhance your development experience, not hinder it. Use these patterns judiciously and always prioritize code readability and maintainability.`,
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
    content: `# The Art of Code Review: Building Better Software Together

Code review is one of the most important practices in software development, yet it is often done poorly or skipped entirely. A well-executed code review process can dramatically improve code quality, catch bugs early, and foster team collaboration.

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

### Team Building
- Foster collaboration and communication
- Build trust and mutual respect
- Create learning opportunities
- Establish shared ownership of the codebase

## Best Practices for Reviewers

### 1. Review Early and Often

Review smaller, focused changes rather than massive pull requests.

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

### 3. Be Constructive and Specific

Provide actionable feedback with examples and suggestions.

## Best Practices for Authors

### 1. Keep PRs Small and Focused

Write pull requests that address a single concern or feature.

### 2. Write Clear Descriptions

Explain what you changed, why you changed it, and how you tested it.

### 3. Respond Constructively to Feedback

Accept feedback gracefully and engage in productive discussions.

## Code Review Checklist

### Functionality
- Does the code do what it's supposed to do?
- Are edge cases handled properly?
- Is error handling appropriate?
- Are there any obvious bugs?

### Design & Architecture  
- Is the code well-structured?
- Does it follow established patterns?
- Is the solution appropriately complex?
- Are abstractions well-chosen?

### Performance
- Are there any obvious performance issues?
- Is the algorithm appropriate?
- Are database queries optimized?
- Is caching used effectively?

### Security
- Is user input properly validated?
- Are authentication/authorization checks in place?
- Are secrets handled securely?
- Is data sanitized appropriately?

### Testing
- Are there appropriate tests?
- Do tests cover edge cases?
- Are tests maintainable?
- Is test coverage adequate?

## Common Anti-Patterns

### The Nitpicker

Focus on logic and architecture rather than trivial formatting issues.

### The Rubber Stamper

Take time to actually review the code thoroughly.

### The Perfectionist

Balance thoroughness with pragmatism and project timelines.

## Building a Review Culture

### Set Clear Expectations
- Define what constitutes a good review
- Establish response time expectations
- Create guidelines for giving and receiving feedback
- Make reviews a required part of the process

### Lead by Example
- Senior developers should model good review behavior
- Take time to write thoughtful reviews
- Accept feedback gracefully
- Celebrate learning opportunities

### Measure and Improve
- Track review metrics
- Gather feedback on the review process
- Continuously refine guidelines
- Share success stories

## Conclusion

Effective code reviews are an art that requires practice, empathy, and clear communication. When done well, they become one of the most valuable practices in your development process.

Remember that the goal isn't to find fault, but to collaboratively build better software. Focus on learning, teaching, and improving together as a team.

The time invested in thoughtful code reviews pays dividends in code quality, team knowledge, and overall project success.`,
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
    // Initialize tables
    await createTables()
    
    for (const post of samplePosts) {
      console.log(`Creating post: ${post.title}`)
      
      const postId = await createPost(post)
      
      console.log(`✅ Created post with ID: ${postId}`)
    }
    
    console.log('🎉 Blog database seeded successfully!')
    
    // Print summary
    const allPosts = await dbAll('SELECT * FROM blog_posts ORDER BY created_at DESC')
    const publishedPosts = await dbAll('SELECT * FROM blog_posts WHERE published = 1 ORDER BY published_at DESC, created_at DESC')
    const featuredPosts = await dbAll('SELECT * FROM blog_posts WHERE published = 1 AND featured = 1 ORDER BY published_at DESC, created_at DESC LIMIT 3')
    const allTags = await dbAll('SELECT * FROM blog_tags ORDER BY name')
    
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
