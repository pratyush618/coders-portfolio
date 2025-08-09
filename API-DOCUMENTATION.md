# Blog API Documentation

This API provides authenticated endpoints for managing blog posts, tags, and retrieving blog statistics.

## Authentication

All write operations (POST, PUT, DELETE) require **Basic Authentication**.

**Default Credentials:**
- Username: `admin`
- Password: `password`

**Environment Variables:**
```bash
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-secure-password
```

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### Status & Health Check

#### GET `/api/status`

Get API status and blog statistics.

**Response:**
```json
{
  "timestamp": "2025-08-09T20:35:46.015Z",
  "authenticated": false,
  "database": "connected",
  "blog": {
    "totalPosts": 4,
    "publishedPosts": 4,
    "featuredPosts": 2,
    "totalTags": 11
  }
}
```

### Blog Posts

#### GET `/api/blog`

Get all published blog posts.

**Query Parameters:**
- `includeUnpublished=true` - Include unpublished posts (requires authentication)

**Response:**
```json
{
  "posts": [
    {
      "id": 1,
      "slug": "building-modern-web-apps-nextjs-15",
      "title": "Building Modern Web Applications with Next.js 15",
      "description": "A comprehensive guide...",
      "content": "# Building Modern Web Applications...",
      "featured": true,
      "published": true,
      "created_at": "2025-08-09 20:37:22",
      "updated_at": "2025-08-09 20:37:22",
      "published_at": "2024-12-15T10:00:00Z",
      "reading_time": 8,
      "cover_image": "https://example.com/image.jpg",
      "author": "Claude",
      "tags": [
        {
          "id": 1,
          "name": "Next.js",
          "slug": "nextjs",
          "description": null,
          "color": "#06b6d4"
        }
      ]
    }
  ]
}
```

#### POST `/api/blog` 🔒

Create a new blog post. **Requires authentication.**

**Request Body:**
```json
{
  "title": "My New Post",
  "description": "Post description (optional)",
  "content": "# Markdown content here",
  "slug": "custom-slug (optional, auto-generated from title)",
  "featured": false,
  "published": true,
  "published_at": "2024-12-15T10:00:00Z (optional)",
  "cover_image": "https://example.com/image.jpg (optional)",
  "author": "Author Name (optional, defaults to 'Claude')",
  "tags": ["Tag1", "Tag2"]
}
```

**Response:**
```json
{
  "message": "Post created successfully",
  "post": { /* Created post object */ }
}
```

#### GET `/api/blog/[slug]`

Get a specific blog post by slug.

**Response:**
```json
{
  "post": { /* Post object with tags */ }
}
```

#### PUT `/api/blog/[slug]` 🔒

Update a specific blog post. **Requires authentication.**

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "content": "Updated content",
  "featured": true,
  "published": false,
  "tags": ["New", "Tags"]
}
```

**Response:**
```json
{
  "message": "Post updated successfully",
  "post": { /* Updated post object */ }
}
```

#### DELETE `/api/blog/[slug]` 🔒

Delete a specific blog post. **Requires authentication.**

**Response:**
```json
{
  "message": "Post deleted successfully",
  "deletedPost": {
    "id": 1,
    "slug": "deleted-post",
    "title": "Deleted Post Title"
  }
}
```

### Tags

#### GET `/api/blog/tags`

Get all tags.

**Response:**
```json
{
  "tags": [
    {
      "id": 1,
      "name": "Next.js",
      "slug": "nextjs",
      "description": null,
      "color": "#06b6d4"
    }
  ]
}
```

#### POST `/api/blog/tags` 🔒

Create a new tag. **Requires authentication.**

**Request Body:**
```json
{
  "name": "New Tag",
  "description": "Tag description (optional)",
  "color": "#ff6b6b (optional, defaults to #06b6d4)"
}
```

**Response:**
```json
{
  "message": "Tag created successfully",
  "tag": { /* Created tag object */ }
}
```

## Example Usage

### Creating a Blog Post

```bash
curl -u "admin:password" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{
    "title": "My Awesome Post",
    "description": "This post is about awesome things",
    "content": "# My Awesome Post\n\nThis is the content of my post.\n\n## Section 1\n\nSome content here.",
    "published": true,
    "featured": false,
    "tags": ["Tutorial", "Web Development"]
  }' \
  "http://localhost:3000/api/blog"
```

### Updating a Post

```bash
curl -u "admin:password" \
  -H "Content-Type: application/json" \
  -X PUT \
  -d '{
    "title": "My Updated Awesome Post",
    "featured": true
  }' \
  "http://localhost:3000/api/blog/my-awesome-post"
```

### Getting All Posts (Including Unpublished)

```bash
curl -u "admin:password" \
  "http://localhost:3000/api/blog?includeUnpublished=true"
```

## Features

- ✅ **Basic Authentication** - Secure API access
- ✅ **CRUD Operations** - Create, Read, Update, Delete posts
- ✅ **Automatic Slug Generation** - From post titles
- ✅ **Reading Time Calculation** - Based on content length
- ✅ **Tag Management** - Create and assign tags
- ✅ **Draft/Published States** - Control post visibility
- ✅ **Featured Posts** - Mark posts as featured
- ✅ **SEO Metadata** - Descriptions and cover images
- ✅ **Automatic Timestamps** - Created and updated dates

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "error": "Error message describing what went wrong"
}
```

## Content Format

Blog content supports **Markdown** format. The API will:
- Calculate reading time automatically
- Process the content for display
- Support code blocks, links, images, and all standard Markdown features

## Security Notes

- All write operations require authentication
- Unpublished posts are only accessible with authentication
- Use strong passwords in production
- Consider using environment variables for credentials
- The API uses Basic Auth - ensure HTTPS in production
