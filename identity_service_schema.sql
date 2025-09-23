-- =============================================
-- IDENTITY SERVICE DATABASE SCHEMA (MySQL)
-- =============================================

-- Database: identity_service
CREATE DATABASE IF NOT EXISTS identity_service;
USE identity_service;

-- =============================================
-- TABLES
-- =============================================

-- 1. ROLE TABLE
CREATE TABLE IF NOT EXISTS role (
    name VARCHAR(255) PRIMARY KEY,
    description TEXT
);

-- 2. PERMISSION TABLE  
CREATE TABLE IF NOT EXISTS permission (
    name VARCHAR(255) PRIMARY KEY,
    description TEXT
);

-- 3. ROLE_PERMISSION TABLE (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS role_permission (
    role_name VARCHAR(255),
    permission_name VARCHAR(255),
    PRIMARY KEY (role_name, permission_name),
    FOREIGN KEY (role_name) REFERENCES role(name) ON DELETE CASCADE,
    FOREIGN KEY (permission_name) REFERENCES permission(name) ON DELETE CASCADE
);

-- 4. USER TABLE
CREATE TABLE IF NOT EXISTS user (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(255) COLLATE utf8mb4_general_ci UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) COLLATE utf8mb4_unicode_ci UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE NOT NULL
);

-- 5. USER_ROLE TABLE (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS user_role (
    user_id VARCHAR(36),
    role_name VARCHAR(255),
    PRIMARY KEY (user_id, role_name),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (role_name) REFERENCES role(name) ON DELETE CASCADE
);

-- 6. INVALIDATED_TOKEN TABLE
CREATE TABLE IF NOT EXISTS invalidated_token (
    id VARCHAR(255) PRIMARY KEY,
    expiry_time DATETIME
);

-- =============================================
-- INDEXES
-- =============================================

-- Indexes for better performance
CREATE INDEX idx_user_username ON user(username);
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_invalidated_token_expiry ON invalidated_token(expiry_time);

-- =============================================
-- COMMENTS
-- =============================================

-- This schema supports:
-- 1. User authentication and authorization
-- 2. Role-based access control (RBAC)
-- 3. JWT token invalidation
-- 4. Case-insensitive username comparison
-- 5. Unicode email support
