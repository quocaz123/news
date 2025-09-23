-- =============================================
-- FILE SERVICE DATABASE SCHEMA (MongoDB)
-- =============================================

-- Database: file_service
-- Note: MongoDB uses collections instead of tables
-- This file shows the document structure for each collection

-- =============================================
-- COLLECTIONS
-- =============================================

-- 1. FILE_MGMT COLLECTION
-- Collection: file_mgmt
-- Document Structure:
/*
{
  "_id": "ObjectId",                    // String id (MongoDB ObjectId)
  "ownerId": "String",                  // User ID who owns the file
  "contentType": "String",              // MIME type (e.g., "image/jpeg", "application/pdf")
  "size": "Number",                     // File size in bytes
  "md5Checksum": "String",              // MD5 hash for file integrity
  "path": "String"                      // File path on storage system
}
*/

-- =============================================
-- INDEXES
-- =============================================

-- MongoDB Indexes (to be created via application or MongoDB shell):

-- File Management Collection Indexes:
-- db.file_mgmt.createIndex({ "ownerId": 1 })
-- db.file_mgmt.createIndex({ "contentType": 1 })
-- db.file_mgmt.createIndex({ "md5Checksum": 1 })
-- db.file_mgmt.createIndex({ "size": 1 })

-- =============================================
-- COMMENTS
-- =============================================

-- This schema supports:
-- 1. File upload and management
-- 2. File ownership tracking
-- 3. Content type filtering
-- 4. File integrity verification (MD5 checksum)
-- 5. Storage path management
-- 6. File size tracking for storage management

-- Common Content Types:
-- image/jpeg, image/png, image/gif, image/webp
-- application/pdf, application/msword
-- text/plain, text/csv
-- video/mp4, video/avi
-- audio/mp3, audio/wav
