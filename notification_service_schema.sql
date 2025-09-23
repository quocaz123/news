-- =============================================
-- NOTIFICATION SERVICE DATABASE SCHEMA
-- =============================================

-- Note: Notification service typically uses in-memory storage or message queues
-- This file shows the conceptual data structure for notifications

-- =============================================
-- CONCEPTUAL DATA STRUCTURE
-- =============================================

-- 1. NOTIFICATION DOCUMENT (if using MongoDB)
-- Collection: notifications
-- Document Structure:
/*
{
  "_id": "ObjectId",                    // String id (MongoDB ObjectId)
  "userId": "String",                   // Target user ID
  "type": "String",                     // Notification type: POST_LIKE, POST_COMMENT, NEW_FOLLOWER, etc.
  "title": "String",                    // Notification title
  "message": "String",                  // Notification message
  "data": "Object",                     // Additional data (postId, commentId, etc.)
  "read": "Boolean",                    // Read status (default: false)
  "createdDate": "ISODate",             // Creation timestamp
  "expiryDate": "ISODate"               // Optional expiry date
}
*/

-- 2. NOTIFICATION TEMPLATE (if using database)
-- Collection: notification_templates
-- Document Structure:
/*
{
  "_id": "ObjectId",                    // String id (MongoDB ObjectId)
  "type": "String",                     // Template type
  "titleTemplate": "String",            // Title template with placeholders
  "messageTemplate": "String",          // Message template with placeholders
  "enabled": "Boolean"                  // Template enabled status
}
*/

-- =============================================
-- REDIS STRUCTURE (Alternative)
-- =============================================

-- If using Redis for real-time notifications:
-- Key pattern: "notifications:{userId}"
-- Data type: List or Stream
-- Example:
/*
LPUSH notifications:user123 {
  "id": "uuid",
  "type": "POST_LIKE",
  "title": "Someone liked your post",
  "message": "John Doe liked your post 'AI Technology'",
  "data": {"postId": "post123"},
  "timestamp": "2024-01-01T10:00:00Z"
}
*/

-- =============================================
-- MESSAGE QUEUE STRUCTURE
-- =============================================

-- If using message queues (RabbitMQ, Kafka, etc.):
-- Queue: notification.queue
-- Message Structure:
/*
{
  "userId": "String",
  "type": "String",
  "title": "String",
  "message": "String",
  "data": "Object",
  "priority": "String",                 // HIGH, MEDIUM, LOW
  "deliveryMethod": "String",           // EMAIL, SMS, PUSH, IN_APP
  "scheduledAt": "ISODate"              // Optional scheduled delivery
}
*/

-- =============================================
-- WEBSOCKET CONNECTION TRACKING
-- =============================================

-- For real-time notifications via WebSocket:
-- Key pattern: "ws:connections:{userId}"
-- Data type: Set
-- Example:
/*
SADD ws:connections:user123 "connection_id_1"
SADD ws:connections:user123 "connection_id_2"
*/

-- =============================================
-- COMMENTS
-- =============================================

-- This schema supports:
-- 1. Real-time notifications via WebSocket
-- 2. Push notifications to mobile devices
-- 3. Email notifications
-- 4. SMS notifications
-- 5. In-app notification history
-- 6. Notification templates for consistency
-- 7. Notification preferences per user
-- 8. Notification delivery tracking
-- 9. Notification expiry and cleanup
-- 10. Priority-based notification delivery

-- Common notification types:
-- POST_LIKE, POST_COMMENT, NEW_FOLLOWER, POST_SHARED
-- SYSTEM_ANNOUNCEMENT, SECURITY_ALERT, WELCOME_MESSAGE
