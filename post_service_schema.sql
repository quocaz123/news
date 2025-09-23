-- =============================================
-- POST SERVICE DATABASE SCHEMA (MongoDB)
-- =============================================

-- Database: post_service
-- Note: MongoDB uses collections instead of tables
-- This file shows the document structure for each collection

-- =============================================
-- COLLECTIONS
-- =============================================

-- 1. POST COLLECTION
-- Collection: post
-- Document Structure:
/*
{
  "_id": "ObjectId",                    // String id (MongoDB ObjectId)
  "userId": "String",                   // User ID who created the post
  "username": "String",                 // Username for display
  "title": "String",                    // Post title
  "description": "String",              // Post description/summary
  "content": "String",                  // Full post content
  "categoryId": "String",               // Category ID reference
  "thumbnailUrl": "String",             // Thumbnail image URL
  "thumbnailFileName": "String",        // Original thumbnail filename
  "tags": ["String"],                   // Array of tags
  "status": "String",                   // PostStatus enum: DRAFT, PUBLISHED, ARCHIVED
  "createdDate": "ISODate",             // Creation timestamp
  "modifiedDate": "ISODate",            // Last modification timestamp
  "views": "Number"                     // View count (default: 0)
}
*/

-- 2. CATEGORY COLLECTION
-- Collection: category
-- Document Structure:
/*
{
  "_id": "ObjectId",                    // String id (MongoDB ObjectId)
  "name": "String",                     // Category name
  "slug": "String"                      // URL-friendly category slug
}
*/

-- 3. POST_REACTIONS COLLECTION
-- Collection: post_reactions
-- Document Structure:
/*
{
  "_id": "ObjectId",                    // String id (MongoDB ObjectId)
  "postId": "String",                   // Post ID reference
  "userId": "String",                   // User ID who reacted
  "type": "String"                      // ReactionType enum: LIKE, DISLIKE
}
*/

-- =============================================
-- INDEXES
-- =============================================

-- MongoDB Indexes (to be created via application or MongoDB shell):

-- Post Collection Indexes:
-- db.post.createIndex({ "userId": 1 })
-- db.post.createIndex({ "categoryId": 1 })
-- db.post.createIndex({ "status": 1 })
-- db.post.createIndex({ "createdDate": -1 })
-- db.post.createIndex({ "tags": 1 })
-- db.post.createIndex({ "title": "text", "description": "text", "content": "text" })

-- Category Collection Indexes:
-- db.category.createIndex({ "slug": 1 }, { unique: true })

-- Post Reactions Collection Indexes:
-- db.post_reactions.createIndex({ "postId": 1, "userId": 1 }, { unique: true })
-- db.post_reactions.createIndex({ "postId": 1 })
-- db.post_reactions.createIndex({ "userId": 1 })

-- =============================================
-- ENUMS
-- =============================================

-- PostStatus Enum Values:
-- DRAFT, PUBLISHED, ARCHIVED

-- ReactionType Enum Values:
-- LIKE, DISLIKE

-- =============================================
-- COMMENTS
-- =============================================

-- This schema supports:
-- 1. Post creation and management
-- 2. Category-based organization
-- 3. User reactions (like/dislike)
-- 4. Full-text search capabilities
-- 5. View tracking
-- 6. Tag-based filtering
