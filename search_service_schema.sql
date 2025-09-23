-- =============================================
-- SEARCH SERVICE DATABASE SCHEMA (Elasticsearch)
-- =============================================

-- Database: search_service
-- Note: Elasticsearch uses indices instead of tables
-- This file shows the index mapping and document structure

-- =============================================
-- INDICES
-- =============================================

-- 1. POSTS INDEX
-- Index Name: posts
-- Document Structure:
/*
{
  "id": "String",                       // Post ID (from post service)
  "title": "String",                    // Post title (text field for full-text search)
  "description": "String",              // Post description (text field for full-text search)
  "categoryName": "String",             // Category name (keyword with lowercase normalizer)
  "username": "String",                 // Username (keyword field)
  "thumbnailUrl": "String",             // Thumbnail URL (keyword field)
  "thumbnailFileName": "String",        // Thumbnail filename (keyword field)
  "createdDate": "Date",                // Creation date (date field)
  "created": "String",                  // Relative time description (keyword field)
  "views": "Integer",                   // View count (integer field)
  "likeCount": "Integer",               // Like count (integer field)
  "dislikeCount": "Integer",            // Dislike count (integer field)
  "tags": ["String"]                    // Array of tags (keyword fields)
}
*/

-- =============================================
-- INDEX MAPPING
-- =============================================

-- Elasticsearch Index Mapping (to be created via API or Kibana):

/*
PUT /posts
{
  "settings": {
    "analysis": {
      "normalizer": {
        "lowercase_normalizer": {
          "type": "custom",
          "filter": ["lowercase"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "id": {
        "type": "keyword"
      },
      "title": {
        "type": "text",
        "analyzer": "standard"
      },
      "description": {
        "type": "text",
        "analyzer": "standard"
      },
      "categoryName": {
        "type": "keyword",
        "normalizer": "lowercase_normalizer"
      },
      "username": {
        "type": "keyword"
      },
      "thumbnailUrl": {
        "type": "keyword"
      },
      "thumbnailFileName": {
        "type": "keyword"
      },
      "createdDate": {
        "type": "date"
      },
      "created": {
        "type": "keyword"
      },
      "views": {
        "type": "integer"
      },
      "likeCount": {
        "type": "integer"
      },
      "dislikeCount": {
        "type": "integer"
      },
      "tags": {
        "type": "keyword"
      }
    }
  }
}
*/

-- =============================================
-- EXAMPLE QUERIES
-- =============================================

-- Full-text search in title and description:
/*
GET /posts/_search
{
  "query": {
    "multi_match": {
      "query": "công nghệ AI",
      "fields": ["title", "description"]
    }
  }
}
*/

-- Filter by category:
/*
GET /posts/_search
{
  "query": {
    "term": {
      "categoryName": "công nghệ"
    }
  }
}
*/

-- Filter by tags:
/*
GET /posts/_search
{
  "query": {
    "terms": {
      "tags": ["AI", "blockchain"]
    }
  }
}
*/

-- Sort by views:
/*
GET /posts/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "views": {
        "order": "desc"
      }
    }
  ]
}
*/

-- =============================================
-- COMMENTS
-- =============================================

-- This schema supports:
-- 1. Full-text search across title and description
-- 2. Category-based filtering
-- 3. Tag-based filtering
-- 4. User-based filtering
-- 5. Date range queries
-- 6. Sorting by views, likes, creation date
-- 7. Aggregations for analytics
-- 8. Case-insensitive category search
-- 9. Real-time search capabilities
-- 10. Faceted search and filtering
