# KIẾN TRÚC HỆ THỐNG TIN TỨC MICROSERVICES

## MỤC LỤC
1. [Tổng quan dự án](#tổng-quan-dự-án)
2. [Phân tích yêu cầu](#phân-tích-yêu-cầu)
3. [Kiến trúc tổng thể](#kiến-trúc-tổng-thể)
4. [Giải pháp kỹ thuật](#giải-pháp-kỹ-thuật)
5. [Chi tiết từng microservice](#chi-tiết-từng-microservice)
6. [Cơ sở dữ liệu và lưu trữ](#cơ-sở-dữ-liệu-và-lưu-trữ)
7. [Bảo mật và xác thực](#bảo-mật-và-xác-thực)
8. [Hiệu suất và khả năng mở rộng](#hiệu-suất-và-khả-năng-mở-rộng)
9. [Triển khai và vận hành](#triển-khai-và-vận-hành)
10. [Kết luận](#kết-luận)

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1 Mô tả hệ thống
Hệ thống tin tức được xây dựng theo kiến trúc microservices, phục vụ hàng triệu người dùng trên toàn thế giới với khả năng xử lý hàng trăm triệu dòng dữ liệu.

### 1.2 Công nghệ sử dụng
- **Backend**: Spring Boot 3.x, Spring Cloud Gateway
- **Frontend**: React 19, Vite, Tailwind CSS
- **Database**: MySQL, MongoDB, Elasticsearch
- **Message Queue**: Apache Kafka
- **Cache**: Redis
- **Container**: Docker, Docker Compose

---

## 2. PHÂN TÍCH YÊU CẦU

### 2.1 Yêu cầu chức năng
| Yêu cầu | Giải pháp đã triển khai |
|---------|------------------------|
| **Bảng tin với tiêu đề, mô tả, nội dung, ngày đăng** | Post Service với MongoDB lưu trữ linh hoạt |
| **Phân loại theo danh mục** | Category Service với quan hệ category-post |
| **Hàng trăm triệu dòng dữ liệu** | MongoDB sharding + Elasticsearch indexing |
| **Duyệt tin theo thứ tự ngày đăng** | Search Service với sorting và pagination |
| **Tìm kiếm tin tức** | Elasticsearch full-text search |
| **Người đưa tin: đăng, sửa, xóa** | Publisher role với CRUD operations |
| **Người dùng: tìm kiếm, duyệt, xem** | Public APIs với caching |
| **Hoạt động liên tục** | Microservices architecture + load balancing |
| **Cập nhật nhanh** | Event-driven architecture với Kafka |

### 2.2 Yêu cầu phi chức năng
- **Scalability**: Horizontal scaling với microservices
- **Availability**: 99.9% uptime với redundancy
- **Performance**: Sub-second response time
- **Security**: JWT authentication + RBAC
- **Maintainability**: Modular architecture

---

## 3. KIẾN TRÚC TỔNG THỂ

### 3.1 Sơ đồ kiến trúc
```
┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Mobile App    │
│   (Frontend)    │    │   (Future)      │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          └──────────┬───────────┘
                     │
          ┌─────────────────┐
          │   API Gateway   │
          │  (Port: 8888)   │
          └─────────┬───────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
┌───▼───┐    ┌─────▼─────┐    ┌────▼────┐
│Identity│    │   Post    │    │ Search  │
│Service │    │ Service   │    │ Service │
│:8080   │    │  :8083    │    │ :8085   │
└───┬───┘    └─────┬─────┘    └────┬────┘
    │              │               │
┌───▼───┐    ┌─────▼─────┐    ┌────▼────┐
│Profile│    │   File    │    │Notification│
│Service │    │ Service   │    │ Service │
│:8081   │    │  :8084    │    │ :8082   │
└───────┘    └───────────┘    └─────────┘
```

### 3.2 Luồng dữ liệu chính
1. **Đăng tin**: Publisher → API Gateway → Post Service → Kafka → Search Service
2. **Tìm kiếm**: User → API Gateway → Search Service → Elasticsearch
3. **Xem tin**: User → API Gateway → Post Service → MongoDB
4. **Authentication**: User → API Gateway → Identity Service → JWT

---

## 4. GIẢI PHÁP KỸ THUẬT

### 4.1 API Gateway Pattern
**Vấn đề**: Quản lý routing và authentication cho nhiều services
**Giải pháp**: Spring Cloud Gateway với:
- **Rate Limiting**: 10 requests/second, burst 20
- **Authentication Filter**: Global JWT validation
- **Route Management**: Path-based routing
- **Load Balancing**: Built-in load balancer

```yaml
# Cấu hình routing
routes:
  - id: post_service
    uri: http://localhost:8083
    predicates:
      - Path=/api/v1/post/**
    filters:
      - StripPrefix=2
```

### 4.2 Event-Driven Architecture
**Vấn đề**: Đồng bộ dữ liệu giữa các services
**Giải pháp**: Apache Kafka với topics:
- `post-created`: Khi tạo bài viết mới
- `post-updated`: Khi cập nhật bài viết
- `post-deleted`: Khi xóa bài viết
- `notification-delivery`: Gửi thông báo

### 4.3 Database per Service
**Vấn đề**: Quản lý dữ liệu cho hàng trăm triệu records
**Giải pháp**: 
- **Post Service**: MongoDB (flexible schema, horizontal scaling)
- **Identity Service**: MySQL (ACID transactions)
- **Search Service**: Elasticsearch (full-text search)
- **File Service**: MongoDB (metadata) + Local storage

### 4.4 Caching Strategy
**Vấn đề**: Giảm latency cho read operations
**Giải pháp**: Redis cho:
- Session management
- Rate limiting
- Frequently accessed data
- API response caching

---

## 5. CHI TIẾT TỪNG MICROSERVICE

### 5.1 Identity Service (Port: 8080)
**Trách nhiệm**: Quản lý người dùng và xác thực

**Công nghệ**: Spring Boot + MySQL + Redis + Kafka

**APIs chính**:
```java
POST /identity/auth/token          // Đăng nhập
POST /identity/auth/register       // Đăng ký
GET  /identity/users               // Lấy danh sách users (Admin)
PUT  /identity/users/{id}          // Cập nhật user
DELETE /identity/users/{id}        // Xóa user
```

**Tính năng**:
- JWT token generation (30 min) + refresh token (7 days)
- Role-based access control (USER, PUBLISHER, ADMIN)
- Password encryption với BCrypt
- Email verification workflow

### 5.2 Post Service (Port: 8083)
**Trách nhiệm**: Quản lý bài viết và danh mục

**Công nghệ**: Spring Boot + MongoDB + Kafka

**APIs chính**:
```java
POST   /post/create                // Tạo bài viết
GET    /post/my-posts              // Lấy bài viết của user
PUT    /post/{id}                  // Cập nhật bài viết
DELETE /post/{id}                  // Xóa bài viết
GET    /post/categories            // Lấy danh mục
POST   /post/{id}/reactions/like   // Like bài viết
```

**Tính năng**:
- CRUD operations cho posts và categories
- File upload integration
- Reaction system (like/dislike)
- Dashboard statistics
- Event publishing cho search indexing

### 5.3 Search Service (Port: 8085)
**Trách nhiệm**: Tìm kiếm và lấy danh sách bài viết

**Công nghệ**: Spring Boot + Elasticsearch + Kafka + WebSocket

**APIs chính**:
```java
GET /search/search/title           // Tìm kiếm theo tiêu đề
GET /search/search/category        // Tìm kiếm theo danh mục
GET /search/latest                 // Lấy bài viết mới nhất
WS  /search/ws                     // WebSocket cho real-time
```

**Tính năng**:
- Full-text search với Elasticsearch
- Real-time indexing từ Kafka events
- WebSocket cho live updates
- Advanced filtering và sorting
- Pagination với performance optimization

### 5.4 File Service (Port: 8084)
**Trách nhiệm**: Quản lý file upload và download

**Công nghệ**: Spring Boot + MongoDB + Local Storage

**APIs chính**:
```java
POST /file/media/upload            // Upload file
GET  /file/media/download/{id}     // Download file
DELETE /file/media/{id}            // Xóa file
```

**Tính năng**:
- File upload với validation (5MB limit)
- Multiple file format support
- Metadata storage trong MongoDB
- CDN-ready với download URLs

### 5.5 Profile Service (Port: 8081)
**Trách nhiệm**: Quản lý thông tin cá nhân

**Công nghệ**: Spring Boot + MongoDB

**Tính năng**:
- User profile management
- Personal information storage
- Integration với Identity Service

### 5.6 Notification Service (Port: 8082)
**Trách nhiệm**: Gửi thông báo và email

**Công nghệ**: Spring Boot + MongoDB + Gmail SMTP + Kafka

**Tính năng**:
- Email notifications
- Welcome emails
- System notifications
- Kafka event consumption

---

## 6. CƠ SỞ DỮ LIỆU VÀ LƯU TRỮ

### 6.1 Chiến lược Database
| Service | Database | Lý do lựa chọn |
|---------|----------|----------------|
| Identity | MySQL | ACID transactions, user data consistency |
| Post | MongoDB | Flexible schema, horizontal scaling |
| Search | Elasticsearch | Full-text search, fast queries |
| File | MongoDB | Metadata storage, file references |
| Profile | MongoDB | User profiles, flexible data |
| Notification | MongoDB | Notification history, logs |

### 6.2 Data Modeling

**Post Document (MongoDB)**:
```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String", 
  "content": "String",
  "categoryId": "String",
  "authorId": "String",
  "status": "PUBLISHED|PENDING|DRAFT",
  "thumbnailUrl": "String",
  "createdAt": "Date",
  "modifiedAt": "Date",
  "views": "Number",
  "likeCount": "Number",
  "dislikeCount": "Number"
}
```

**User Entity (MySQL)**:
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6.3 Indexing Strategy
- **MongoDB**: Compound indexes trên (categoryId, createdAt), (authorId, status)
- **Elasticsearch**: Full-text indexes trên title, description, content
- **MySQL**: Indexes trên username, email cho fast lookups

---

## 7. BẢO MẬT VÀ XÁC THỰC

### 7.1 Authentication Flow
```
1. User Login → Identity Service
2. JWT Token Generation (30 min validity)
3. Refresh Token (7 days validity)
4. API Gateway validates tokens
5. Service-to-service communication
```

### 7.2 Authorization Matrix
| Role | Permissions |
|------|-------------|
| **USER** | Read posts, search, like/dislike |
| **PUBLISHER** | Create/edit/delete own posts, read all |
| **ADMIN** | Full system access, user management |

### 7.3 Security Measures
- **JWT Tokens**: Stateless authentication
- **Password Encryption**: BCrypt hashing
- **Rate Limiting**: Prevent abuse (10 req/sec)
- **CORS Configuration**: Cross-origin security
- **Input Validation**: XSS and injection prevention

---

## 8. HIỆU SUẤT VÀ KHẢ NĂNG MỞ RỘNG

### 8.1 Performance Optimization
- **Caching**: Redis cho frequently accessed data
- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient DB connections
- **Async Processing**: Kafka cho non-blocking operations
- **CDN Ready**: Static file serving

### 8.2 Scalability Solutions
- **Horizontal Scaling**: Stateless microservices
- **Load Balancing**: API Gateway + service instances
- **Database Sharding**: MongoDB sharding cho large datasets
- **Elasticsearch Clustering**: Search service scaling
- **Kafka Partitioning**: Message distribution

### 8.3 Monitoring và Observability
- **Health Checks**: Spring Boot Actuator
- **Logging**: Structured logging với SLF4J
- **Metrics**: Application metrics exposure
- **Error Tracking**: Centralized error handling

---

## 9. TRIỂN KHAI VÀ VẬN HÀNH

### 9.1 Development Environment
```yaml
# docker-compose.yml
services:
  kafka:
    image: bitnami/kafka:3.8.0
    ports: ["9094:9094"]
  
  mysql:
    image: mysql:8.0
    ports: ["3306:3306"]
  
  mongodb:
    image: mongo:6.0
    ports: ["27017:27017"]
  
  redis:
    image: redis:7.0
    ports: ["6379:6379"]
  
  elasticsearch:
    image: elasticsearch:8.8.0
    ports: ["9200:9200"]
```

### 9.2 Port Allocation
| Service | Port | Purpose |
|---------|------|---------|
| API Gateway | 8888 | Entry point |
| Identity | 8080 | Authentication |
| Profile | 8081 | User profiles |
| Notification | 8082 | Notifications |
| Post | 8083 | Content management |
| File | 8084 | File handling |
| Search | 8085 | Search & listing |

### 9.3 Deployment Strategy
- **Containerization**: Docker cho all services
- **Orchestration**: Docker Compose cho development
- **Production Ready**: Kubernetes deployment
- **CI/CD**: Automated testing và deployment

---

## 10. KẾT LUẬN

### 10.1 Đánh giá giải pháp
Dự án đã thành công giải quyết tất cả yêu cầu của đề bài:

✅ **Bảng tin đầy đủ**: Tiêu đề, mô tả, nội dung, ngày đăng
✅ **Phân loại danh mục**: Category system với MongoDB
✅ **Hàng trăm triệu dữ liệu**: MongoDB sharding + Elasticsearch
✅ **Duyệt theo ngày**: Search service với sorting
✅ **Tìm kiếm**: Elasticsearch full-text search
✅ **Publisher features**: CRUD operations với role-based access
✅ **User features**: Search, browse, view với public APIs
✅ **High availability**: Microservices + load balancing
✅ **Real-time updates**: Event-driven architecture với Kafka

### 10.2 Ưu điểm của kiến trúc
- **Scalability**: Horizontal scaling capability
- **Maintainability**: Modular microservices
- **Performance**: Optimized với caching và indexing
- **Security**: Comprehensive authentication/authorization
- **Reliability**: Fault tolerance với service isolation

### 10.3 Hướng phát triển
- **Mobile App**: API-ready cho mobile development
- **Advanced Analytics**: User behavior tracking
- **Content Recommendation**: AI-powered suggestions
- **Multi-language Support**: Internationalization
- **CDN Integration**: Global content delivery

---


