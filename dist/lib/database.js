"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogDb = void 0;
var better_sqlite3_1 = require("better-sqlite3");
var path_1 = require("path");
var dbPath = path_1.default.join(process.cwd(), 'blog.db');
var db = new better_sqlite3_1.default(dbPath);
// Enable foreign keys
db.pragma('foreign_keys = ON');
// Create tables
var createTables = function () {
    // Blog posts table
    db.exec("\n    CREATE TABLE IF NOT EXISTS blog_posts (\n      id INTEGER PRIMARY KEY AUTOINCREMENT,\n      slug TEXT UNIQUE NOT NULL,\n      title TEXT NOT NULL,\n      description TEXT,\n      content TEXT NOT NULL,\n      featured BOOLEAN DEFAULT FALSE,\n      published BOOLEAN DEFAULT FALSE,\n      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n      published_at DATETIME,\n      reading_time INTEGER,\n      cover_image TEXT,\n      author TEXT DEFAULT 'Claude'\n    )\n  ");
    // Blog tags table
    db.exec("\n    CREATE TABLE IF NOT EXISTS blog_tags (\n      id INTEGER PRIMARY KEY AUTOINCREMENT,\n      name TEXT UNIQUE NOT NULL,\n      slug TEXT UNIQUE NOT NULL,\n      description TEXT,\n      color TEXT DEFAULT '#06b6d4'\n    )\n  ");
    // Blog post tags junction table
    db.exec("\n    CREATE TABLE IF NOT EXISTS blog_post_tags (\n      post_id INTEGER,\n      tag_id INTEGER,\n      PRIMARY KEY (post_id, tag_id),\n      FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,\n      FOREIGN KEY (tag_id) REFERENCES blog_tags(id) ON DELETE CASCADE\n    )\n  ");
    // Update trigger for updated_at
    db.exec("\n    CREATE TRIGGER IF NOT EXISTS update_blog_posts_updated_at\n    AFTER UPDATE ON blog_posts\n    BEGIN\n      UPDATE blog_posts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;\n    END\n  ");
};
// Initialize database
createTables();
// Blog post operations
exports.blogDb = {
    // Get all published posts
    getPublishedPosts: function () {
        var stmt = db.prepare("\n      SELECT * FROM blog_posts \n      WHERE published = TRUE \n      ORDER BY published_at DESC, created_at DESC\n    ");
        return stmt.all();
    },
    // Get all posts (including drafts)
    getAllPosts: function () {
        var stmt = db.prepare("\n      SELECT * FROM blog_posts \n      ORDER BY created_at DESC\n    ");
        return stmt.all();
    },
    // Get post by slug
    getPostBySlug: function (slug) {
        var stmt = db.prepare("\n      SELECT * FROM blog_posts \n      WHERE slug = ? AND published = TRUE\n    ");
        var post = stmt.get(slug);
        if (post) {
            // Get tags for this post
            var tagStmt = db.prepare("\n        SELECT t.* FROM blog_tags t\n        JOIN blog_post_tags pt ON t.id = pt.tag_id\n        WHERE pt.post_id = ?\n      ");
            post.tags = tagStmt.all(post.id);
        }
        return post;
    },
    // Get featured posts
    getFeaturedPosts: function (limit) {
        if (limit === void 0) { limit = 3; }
        var stmt = db.prepare("\n      SELECT * FROM blog_posts \n      WHERE published = TRUE AND featured = TRUE \n      ORDER BY published_at DESC, created_at DESC \n      LIMIT ?\n    ");
        return stmt.all(limit);
    },
    // Create new post
    createPost: function (post) {
        var stmt = db.prepare("\n      INSERT INTO blog_posts (\n        slug, title, description, content, featured, published, \n        published_at, reading_time, cover_image, author\n      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n    ");
        var result = stmt.run(post.slug, post.title, post.description || null, post.content, post.featured || false, post.published || false, post.published_at || null, post.reading_time || null, post.cover_image || null, post.author || 'Claude');
        // Add tags if provided
        if (post.tags && post.tags.length > 0) {
            exports.blogDb.addTagsToPost(result.lastInsertRowid, post.tags);
        }
        return result.lastInsertRowid;
    },
    // Update post
    updatePost: function (id, post) {
        var fields = Object.keys(post).filter(function (key) { return key !== 'tags'; });
        var values = fields.map(function (field) { return post[field]; });
        if (fields.length > 0) {
            var setClause = fields.map(function (field) { return "".concat(field, " = ?"); }).join(', ');
            var stmt = db.prepare("UPDATE blog_posts SET ".concat(setClause, " WHERE id = ?"));
            stmt.run.apply(stmt, __spreadArray(__spreadArray([], values, false), [id], false));
        }
        // Update tags if provided
        if (post.tags) {
            exports.blogDb.updatePostTags(id, post.tags);
        }
    },
    // Delete post
    deletePost: function (id) {
        var stmt = db.prepare('DELETE FROM blog_posts WHERE id = ?');
        return stmt.run(id);
    },
    // Tag operations
    getAllTags: function () {
        var stmt = db.prepare('SELECT * FROM blog_tags ORDER BY name');
        return stmt.all();
    },
    createTag: function (name, slug, description, color) {
        var stmt = db.prepare("\n      INSERT INTO blog_tags (name, slug, description, color) \n      VALUES (?, ?, ?, ?)\n    ");
        return stmt.run(name, slug, description || null, color || '#06b6d4');
    },
    addTagsToPost: function (postId, tagNames) {
        var insertTagStmt = db.prepare("\n      INSERT OR IGNORE INTO blog_tags (name, slug) \n      VALUES (?, ?)\n    ");
        var getTagStmt = db.prepare('SELECT id FROM blog_tags WHERE name = ?');
        var linkStmt = db.prepare("\n      INSERT OR IGNORE INTO blog_post_tags (post_id, tag_id) \n      VALUES (?, ?)\n    ");
        for (var _i = 0, tagNames_1 = tagNames; _i < tagNames_1.length; _i++) {
            var tagName = tagNames_1[_i];
            var slug = tagName.toLowerCase().replace(/\s+/g, '-');
            insertTagStmt.run(tagName, slug);
            var tag = getTagStmt.get(tagName);
            if (tag) {
                linkStmt.run(postId, tag.id);
            }
        }
    },
    updatePostTags: function (postId, tagNames) {
        // Remove existing tags
        var deleteStmt = db.prepare('DELETE FROM blog_post_tags WHERE post_id = ?');
        deleteStmt.run(postId);
        // Add new tags
        if (tagNames.length > 0) {
            exports.blogDb.addTagsToPost(postId, tagNames);
        }
    },
    // Get posts by tag
    getPostsByTag: function (tagSlug) {
        var stmt = db.prepare("\n      SELECT p.* FROM blog_posts p\n      JOIN blog_post_tags pt ON p.id = pt.post_id\n      JOIN blog_tags t ON pt.tag_id = t.id\n      WHERE t.slug = ? AND p.published = TRUE\n      ORDER BY p.published_at DESC, p.created_at DESC\n    ");
        return stmt.all(tagSlug);
    }
};
exports.default = db;
