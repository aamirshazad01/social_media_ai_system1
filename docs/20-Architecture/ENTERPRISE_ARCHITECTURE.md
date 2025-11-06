# Enterprise-Ready Backend Architecture

## 🎯 Overview

This document describes the completely redesigned, enterprise-ready backend architecture for Social Media OS. The system has been rebuilt from the ground up with enterprise best practices, clean architecture patterns, and production-grade security.

**Current Status**: Phase 1 (Foundation) ✅ 95% Complete

---

## Phase 1: Foundation & Core Infrastructure ✅

### ✅ 1.1: Database Schema Redesign

**Location**: `src/lib/supabase/migrations/004_complete_schema_redesign.sql`

**Key Improvements**:
- **Proper Normalization**: Replaced array fields with junction tables
  - `post_platforms` (replaces `platforms` array)
  - `post_media` (replaces `used_in_posts` array)
  - Proper many-to-many relationships

- **New Tables**:
  - `post_content` - Post versioning and history tracking
  - `campaign_analytics` - Aggregated campaign metrics
  - `a_b_tests` & `a_b_test_variants` - A/B testing framework
  - `activity_logs` - Comprehensive audit trail

- **Performance Optimizations**:
  - 50+ strategic indexes for query optimization
  - Composite indexes for common query patterns
  - Partial indexes for soft-deletes

- **Security**:
  - Row-Level Security (RLS) policies on all tables
  - Workspace isolation at database level
  - Role-based access control enforced in database

- **Data Integrity**:
  - Proper foreign keys with CASCADE rules
  - Auto-update triggers for `updated_at` timestamps
  - Check constraints for data validation

**Tables**: 17 core + 2 junction tables (total 19)

---

### ✅ 1.2: TypeScript Type Definitions

**Location**: `src/lib/supabase/types.ts`

- Complete type definitions for all tables
- Generated from new database schema
- Full IntelliSense support in IDE
- Type-safe database operations

---

### ✅ 1.3: Zod Validation Schemas

**Location**: `src/lib/validation/schemas.ts`

**Coverage**:
- ✅ Workspace management (create, update)
- ✅ User management (create, update, role changes)
- ✅ Social account connections
- ✅ Campaign management (create, update, archive)
- ✅ Post management (create, update, publish, schedule)
- ✅ Media assets (upload, tag, organize)
- ✅ Post-media relationships
- ✅ Approval workflow
- ✅ A/B testing
- ✅ AI content generation
- ✅ Analytics fetching
- ✅ Search & filtering
- ✅ Pagination (offset & cursor-based)

**Features**:
- Comprehensive input validation
- Custom error messages
- Type-safe schema inference
- Safe parse utilities with error handling

---

### ✅ 1.4: Error Handling System

**Location**: `src/core/errors/AppError.ts`

**Error Classes**:
- `AppError` - Base error class
- `ValidationError` - 400 errors
- `UnauthorizedError` - 401 errors
- `ForbiddenError` - 403 errors
- `NotFoundError` - 404 errors
- `ConflictError` - 409 errors
- `RateLimitError` - 429 errors
- `DatabaseError` - 500 errors
- `ExternalAPIError` - 502 errors
- `OAuthError` - OAuth failures
- `EncryptionError` - Encryption failures
- `ServiceUnavailableError` - 503 errors
- `TimeoutError` - 504 errors

**Features**:
- Consistent error codes
- Proper HTTP status codes
- Detailed error information
- Safe error logging (no sensitive data leakage)
- Type-safe error handling

---

### ✅ 1.5: Repository Pattern

**Location**: `src/core/database/Repository.ts`

**Features**:
- Abstract `Repository<T, CreateDTO, UpdateDTO>` base class
- Standardized database operation interface
- `QueryBuilder` for flexible WHERE clauses
- `Pagination` helper for offset-based pagination
- `CursorPagination` helper for cursor-based pagination
- `RepositoryResult` wrapper for consistent responses

**Methods**:
- `findAll()` - Get all records
- `findById()` - Get single record
- `find()` - Search by criteria
- `findFirst()` - Get first matching record
- `count()` - Count records
- `create()` - Create new record
- `update()` - Update record by ID
- `delete()` - Delete record
- `deleteMany()` - Batch delete
- `exists()` - Check existence
- `paginate()` - Offset-based pagination
- `cursorPaginate()` - Cursor-based pagination
- `upsert()` - Create or update

---

### ✅ 1.6: Data Transfer Objects (DTOs)

**Location**: `src/core/types/DTOs.ts`

**Coverage**:
- Workspace DTOs
- User DTOs (with public variant)
- Social Account DTOs (with public variant)
- Campaign DTOs (with analytics variant)
- Post DTOs (with content & relationships)
- Media Asset DTOs
- Post-Media Relationship DTOs
- Approval DTOs (with user details)
- Post Analytics DTOs
- A/B Test DTOs
- Activity Log DTOs
- Workspace Invite DTOs
- Request Context DTO
- Pagination DTOs
- Response DTOs (success & error)

**Purpose**:
- Clean separation between database models and API responses
- Type-safe data transfer
- Easy API versioning
- Consistent API contracts

---

### ✅ 1.7: Authentication Middleware

**Location**: `src/core/middleware/auth.ts`

**Functions**:
- `getAuthUser()` - Get authenticated user from JWT
- `getUserWorkspace()` - Get user's workspace info
- `createRequestContext()` - Full request context with auth
- `requireAdmin()` - Enforce admin role
- `requireEditor()` - Enforce editor+ role
- `requireRole()` - Flexible role checking
- `extractRequestMetadata()` - Extract IP, user agent
- `generateRequestId()` - Generate request IDs for tracing

**Features**:
- JWT validation via Supabase
- Workspace isolation checks
- User status validation
- Workspace status validation
- Request metadata extraction
- Request ID generation for tracing

---

### ✅ 1.8: Response Handler Middleware

**Location**: `src/core/middleware/responseHandler.ts`

**Functions**:
- `successResponse()` - Format success responses
- `errorResponse()` - Format error responses
- `validationErrorResponse()` - Format validation errors
- `paginatedResponse()` - Format paginated responses
- `cursorPaginatedResponse()` - Format cursor-paginated responses
- `handleAsync()` - Wrap async handlers with error catching
- `isSuccessResponse()` - Type guard for success
- `isErrorResponse()` - Type guard for error
- `extractResponseData()` - Extract response JSON

**Features**:
- Consistent response format across all endpoints
- Automatic error handling
- Built-in request ID tracking
- Pagination helpers
- Type guards for response handling

---

## 🏗️ Architecture Diagrams

### Data Flow

```
User Request
    ↓
Authentication Middleware (auth.ts)
    ↓ (Creates RequestContext)
Route Handler
    ↓
Validation (Zod schemas)
    ↓ (Throws ValidationError if invalid)
Business Logic Service
    ↓
Repository Pattern
    ↓ (Database abstraction)
Supabase/PostgreSQL
    ↓
Response Formatter (responseHandler.ts)
    ↓
Consistent JSON Response to Client
```

### Layer Architecture

```
┌─────────────────────────────────┐
│     API Routes (Thin)           │
│  - Route handlers               │
│  - Parameter extraction         │
│  - Response formatting          │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  Middleware Layer               │
│  - Authentication               │
│  - Request validation           │
│  - Error handling               │
│  - Response formatting          │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  Service Layer                  │
│  - Business logic               │
│  - Orchestration                │
│  - Data transformation          │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  Repository Pattern             │
│  - Database abstraction         │
│  - Query building               │
│  - Transaction handling         │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  Database Layer                 │
│  - Supabase PostgreSQL          │
│  - RLS Policies                 │
│  - Indexes                      │
└─────────────────────────────────┘
```

---

## 📁 New Directory Structure

```
src/
├── app/api/                    # API routes (to be rebuilt)
│
├── core/
│   ├── database/
│   │   ├── Repository.ts       # Base repository pattern
│   │   └── repositories/       # Concrete implementations (coming soon)
│   │
│   ├── errors/
│   │   └── AppError.ts         # Error handling system
│   │
│   ├── middleware/
│   │   ├── auth.ts             # Authentication middleware
│   │   └── responseHandler.ts  # Response formatting
│   │
│   └── types/
│       └── DTOs.ts             # Data transfer objects
│
├── lib/
│   ├── supabase/
│   │   ├── migrations/
│   │   │   └── 004_complete_schema_redesign.sql
│   │   └── types.ts            # TypeScript definitions
│   │
│   └── validation/
│       └── schemas.ts          # Zod validation schemas
│
├── services/                   # Business logic (to be refactored)
│
└── components/                 # Frontend (unchanged)
```

---

## 🔐 Security Features Implemented

### Database Level
- ✅ Row-Level Security (RLS) on all tables
- ✅ Workspace isolation enforced
- ✅ Role-based table access
- ✅ Foreign key constraints

### API Level (Ready in Phase 1.9)
- ✅ JWT authentication
- ✅ Request validation (Zod)
- ✅ Input sanitization schemas
- ⏳ Rate limiting (Phase 1.9)
- ⏳ CSRF protection (Phase 1.9)

### Error Handling
- ✅ No stack traces in production
- ✅ Sanitized error messages
- ✅ Safe error logging
- ⏳ Error tracking integration (Phase 2+)

---

## 📊 Schema Overview

### Core Tables (17)
| Table | Purpose | Rows | Indexes |
|-------|---------|------|---------|
| `workspaces` | Tenant isolation | Few | 2 |
| `users` | User accounts | Moderate | 4 |
| `social_accounts` | Platform credentials | Few per workspace | 5 |
| `campaigns` | Campaign organization | Moderate | 5 |
| `posts` | Content pieces | High | 6 |
| `post_content` | Post versions | Very High | 3 |
| `post_platforms` | Platform assignments | High | 3 |
| `media_assets` | Media library | Moderate | 5 |
| `post_media` | Post-media links | High | 3 |
| `approvals` | Post approvals | Moderate | 3 |
| `post_analytics` | Post metrics | Very High | 5 |
| `activity_logs` | Audit trail | Very High | 4 |
| `oauth_states` | OAuth security | Temporary | 4 |
| `workspace_invites` | Invitations | Few | 4 |
| `a_b_tests` | A/B tests | Moderate | 2 |
| `a_b_test_variants` | Test variants | Moderate | 2 |
| `campaign_analytics` | Campaign metrics | Moderate | 3 |

**Total Indexes**: ~60+ optimized indexes

---

## 🚀 What's Next: Phase 1.9

### Feature 1.9: Rate Limiting & Security Headers

```typescript
// Will implement:
- @upstash/ratelimit for rate limiting
- 10 requests/minute per IP
- 100 requests/minute per authenticated user
- Security headers middleware
  - CSP (Content Security Policy)
  - HSTS (HTTP Strict Transport Security)
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
- CORS configuration
- Request size limits
```

### Feature 1.10: Move API Keys to Server-Only

```typescript
// Will move:
- GEMINI_API_KEY from NEXT_PUBLIC to server-only
- Create /api/ai/generate proxy endpoint
- Environment variable validation
- Secret management
```

---

## 🎓 How to Use This Architecture

### Creating a New Feature (Example: Post Repository)

1. **Define DTOs** (in `src/core/types/DTOs.ts`)
   ```typescript
   export interface PostDTO { ... }
   export interface CreatePostDTO { ... }
   export interface UpdatePostDTO { ... }
   ```

2. **Create Repository** (in `src/core/database/repositories/PostRepository.ts`)
   ```typescript
   export class PostRepository extends Repository<PostDTO, CreatePostDTO, UpdatePostDTO> {
     // Implement abstract methods
     async findAll() { ... }
     async findById(id) { ... }
     // etc.
   }
   ```

3. **Create Service** (in `src/services/posts/PostService.ts`)
   ```typescript
   export class PostService {
     constructor(private repository: PostRepository) {}

     async createPost(context: RequestContext, data: CreatePostDTO) {
       // Validate business logic
       // Call repository
       // Return formatted DTO
     }
   }
   ```

4. **Create API Route** (in `src/app/api/posts/route.ts`)
   ```typescript
   export async function POST(req: Request) {
     try {
       const context = await createRequestContext(...)
       const data = CreatePostSchema.parse(await req.json())
       const service = new PostService(new PostRepository())
       const result = await service.createPost(context, data)
       return successResponse(result, 201)
     } catch (error) {
       return errorResponse(error)
     }
   }
   ```

---

## 📚 Key Principles

1. **Separation of Concerns**
   - Routes handle HTTP concerns only
   - Services handle business logic
   - Repositories handle data access

2. **Type Safety**
   - DTOs ensure consistent data types
   - Zod schemas validate at boundaries
   - TypeScript catches errors at compile time

3. **Error Handling**
   - All errors converted to AppError
   - Consistent HTTP status codes
   - No sensitive information leaked

4. **Database Isolation**
   - RLS policies enforce workspace isolation
   - Users can't access other workspaces
   - Even with admin access to database

5. **Performance**
   - Strategic indexes on high-traffic queries
   - Pagination prevents massive data transfers
   - DTOs allow selective field loading

6. **Maintainability**
   - Clear folder structure
   - Consistent naming conventions
   - Comprehensive documentation
   - Type-safe operations

---

## 📈 Metrics & Performance

### Database
- **Indexes**: 60+ optimized indexes
- **Tables**: 17 normalized tables
- **Queries**: All have proper indexes
- **RLS Policies**: Full workspace isolation

### API Response Format
```json
{
  "success": true,
  "data": {...},
  "message": "Optional message"
}

or

{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {...},
  "requestId": "req_..."
}
```

---

## 🔄 Migration Path from Old to New

Since we're not maintaining backward compatibility:

1. **Database**: Run migration `004_complete_schema_redesign.sql`
2. **Code**: Rebuild API routes with new pattern
3. **Frontend**: No changes needed (API contract similar)

---

## ✅ Checklist: Phase 1 Complete

- ✅ Database schema redesigned (proper normalization)
- ✅ TypeScript types generated
- ✅ Zod validation schemas created
- ✅ Error handling system implemented
- ✅ Repository pattern defined
- ✅ DTOs comprehensive
- ✅ Auth middleware ready
- ✅ Response handler middleware ready
- ⏳ Rate limiting (Phase 1.9)
- ⏳ Security headers (Phase 1.9)
- ⏳ API key migration (Phase 1.10)

**Completion**: ~95% ✅

---

## 🎯 Next Phases

**Phase 2**: Authentication & Authorization System (1-2 weeks)
- Enhanced auth system
- Workspace management
- RBAC implementation

**Phase 3**: Platform Integration Layer (2-3 weeks)
- Unified platform service
- Credential management overhaul
- OAuth flow improvements

**Phase 4**: Content Management (2 weeks)
- Post management rebuild
- Media library system
- AI content generation API

**Phase 5**: Campaign Management (1 week)
- Campaign system
- Analytics
- A/B testing

**Phase 6**: Publishing & Analytics (1 week)
- Multi-platform publishing
- Analytics collection
- Approval workflow

**Phase 7**: Supporting Features (1 week)
- Search & filtering
- Email notifications
- Activity logging
- Settings

**Phase 8**: Performance & Polish (1 week)
- Caching layer
- Pagination optimization
- Error logging
- Documentation

**Total Timeline**: 10-11 weeks with 1 engineer

---

## 📞 Questions?

Refer to:
- Database schema: `src/lib/supabase/migrations/004_complete_schema_redesign.sql`
- Error codes: `src/core/errors/AppError.ts`
- Validation: `src/lib/validation/schemas.ts`
- DTOs: `src/core/types/DTOs.ts`
- Middleware: `src/core/middleware/`

---

**Last Updated**: 2025-11-06
**Status**: Phase 1 - Foundation ✅
**Next Step**: Rate Limiting & Security (Phase 1.9)
