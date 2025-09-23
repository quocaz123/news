-- =============================================
-- PROFILE SERVICE DATABASE SCHEMA (Neo4j)
-- =============================================

-- Database: profile_service
-- Note: Neo4j uses nodes and relationships instead of tables
-- This file shows the node structure and relationships

-- =============================================
-- NODES
-- =============================================

-- 1. USER_PROFILE NODE
-- Node Label: user_profile
-- Node Structure:
/*
{
  "id": "String",                       // UUID string (auto-generated)
  "userId": "String",                   // Reference to identity service user ID
  "username": "String",                 // Username for display
  "firstName": "String",                // User's first name
  "lastName": "String",                 // User's last name
  "dob": "Date",                        // Date of birth (LocalDate)
  "city": "String"                      // User's city
}
*/

-- =============================================
-- CONSTRAINTS
-- =============================================

-- Neo4j Constraints (to be created via Cypher):

-- Unique constraints:
-- CREATE CONSTRAINT user_profile_id_unique FOR (up:user_profile) REQUIRE up.id IS UNIQUE;
-- CREATE CONSTRAINT user_profile_userId_unique FOR (up:user_profile) REQUIRE up.userId IS UNIQUE;

-- =============================================
-- INDEXES
-- =============================================

-- Neo4j Indexes (to be created via Cypher):

-- Performance indexes:
-- CREATE INDEX user_profile_username_index FOR (up:user_profile) ON (up.username);
-- CREATE INDEX user_profile_city_index FOR (up:user_profile) ON (up.city);
-- CREATE INDEX user_profile_dob_index FOR (up:user_profile) ON (up.dob);

-- =============================================
-- EXAMPLE QUERIES
-- =============================================

-- Create a user profile:
/*
CREATE (up:user_profile {
  id: 'generated-uuid',
  userId: 'user-id-from-identity-service',
  username: 'john_doe',
  firstName: 'John',
  lastName: 'Doe',
  dob: date('1990-01-01'),
  city: 'Ho Chi Minh City'
})
*/

-- Find user by username:
/*
MATCH (up:user_profile {username: 'john_doe'})
RETURN up
*/

-- Find users by city:
/*
MATCH (up:user_profile {city: 'Ho Chi Minh City'})
RETURN up
*/

-- =============================================
-- COMMENTS
-- =============================================

-- This schema supports:
-- 1. User profile management
-- 2. Personal information storage
-- 3. Geographic-based queries
-- 4. Age-based filtering
-- 5. Profile relationships (can be extended for social features)
-- 6. Integration with identity service via userId reference

-- Future relationship possibilities:
-- - FOLLOWS relationship between users
-- - LIVES_IN relationship with city nodes
-- - INTERESTED_IN relationship with topic nodes
