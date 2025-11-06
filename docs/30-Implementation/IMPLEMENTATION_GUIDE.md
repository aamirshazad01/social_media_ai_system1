# Implementation Guide: How to Add New Features

This guide shows you exactly how to add new features to the Social Media OS backend using the enterprise-ready architecture.

## Overview: The 5-Layer Architecture

```
1. API Routes (Controllers)  - Handle HTTP requests/responses
2. Services (Business Logic) - Validate, coordinate, enforce rules
3. Repositories (Data Layer) - Abstract database access
4. Database Models (TypeScript) - Type-safe data definitions
5. Database (PostgreSQL)     - Persistent data storage
```

---

## Step-by-Step: Adding a New Feature

Let's use **Campaign Management** as an example:

### 1️⃣ DEFINE DATA TYPES (DTOs)

**File**: `src/core/types/DTOs.ts`

```typescript
// Already done! See CampaignDTO, CreateCampaignDTO, UpdateCampaignDTO
export interface CampaignDTO {
  id: string
  workspace_id: string
  name: string
  description: string | null
  goal: string | null
  status: string
  start_date: string | null
  end_date: string | null
  color: string | null
  // ... other fields
}

export interface CreateCampaignDTO {
  name: string
  description?: string
  goal?: string
  color?: string
  start_date?: string
  end_date?: string
  // ...
}

export interface UpdateCampaignDTO {
  // Same as CreateCampaignDTO but all optional
}
```

### 2️⃣ CREATE VALIDATION SCHEMAS

**File**: `src/lib/validation/schemas.ts`

```typescript
// Already done! See CreateCampaignSchema, UpdateCampaignSchema
export const CreateCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').max(255),
  description: z.string().max(1000).optional(),
  goal: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color code').optional(),
  start_date: DateSchema.optional(),
  end_date: DateSchema.optional(),
  // ...
})

export type CreateCampaignInput = z.infer<typeof CreateCampaignSchema>
```

### 3️⃣ CREATE REPOSITORY

**File**: `src/core/database/repositories/CampaignRepository.ts`

```typescript
import { Repository } from '../Repository'
import { CampaignDTO, CreateCampaignDTO, UpdateCampaignDTO } from '../../types/DTOs'
import { Database } from '@/lib/supabase/types'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { DatabaseError } from '../../errors/AppError'

export class CampaignRepository
  extends Repository<CampaignDTO, CreateCampaignDTO, UpdateCampaignDTO> {

  protected tableName = 'campaigns'

  private async getSupabase() {
    const cookieStore = await cookies()
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch (error) { }
          }
        }
      }
    )
  }

  async findAll(options?: FindOptions): Promise<CampaignDTO[]> {
    try {
      const supabase = await this.getSupabase()
      // Implementation using Supabase client
    } catch (error) {
      throw new DatabaseError('Failed to fetch campaigns', { error: String(error) })
    }
  }

  async findById(id: string): Promise<CampaignDTO | null> {
    // Implementation
  }

  // ... implement other abstract methods
}
```

**Key Methods**:
- `findAll()` - Get all records (with options for filtering, sorting, pagination)
- `findById(id)` - Get single record
- `find(where)` - Search by criteria
- `findFirst(where)` - Get first matching
- `count(where)` - Count records
- `create(data)` - Create new
- `update(id, data)` - Update existing
- `delete(id)` - Delete (soft delete)
- `deleteMany(where)` - Batch delete
- `exists(where)` - Check existence
- `paginate()` - Offset-based pagination
- `cursorPaginate()` - Cursor-based pagination
- `upsert()` - Create or update

---

### 4️⃣ CREATE SERVICE LAYER

**File**: `src/services/CampaignService.ts`

```typescript
import { CampaignRepository } from '@/core/database/repositories/CampaignRepository'
import {
  CampaignDTO,
  CreateCampaignDTO,
  UpdateCampaignDTO,
  RequestContext
} from '@/core/types/DTOs'
import {
  ValidationError,
  ForbiddenError,
  NotFoundError,
  ConflictError
} from '@/core/errors/AppError'
import { CreateCampaignSchema, UpdateCampaignSchema } from '@/lib/validation/schemas'

export class CampaignService {
  private repository: CampaignRepository

  constructor(repository?: CampaignRepository) {
    this.repository = repository || new CampaignRepository()
  }

  /**
   * Create campaign
   */
  async createCampaign(
    context: RequestContext,
    data: CreateCampaignDTO
  ): Promise<CampaignDTO> {
    try {
      // 1. Validate input
      const validatedData = CreateCampaignSchema.parse(data)

      // 2. Business logic validation
      if (validatedData.start_date && validatedData.end_date) {
        if (new Date(validatedData.start_date) > new Date(validatedData.end_date)) {
          throw new ValidationError('Start date must be before end date')
        }
      }

      // 3. Check permissions (only editors and admins)
      if (!['admin', 'editor'].includes(context.userRole)) {
        throw new ForbiddenError('Only editors and admins can create campaigns')
      }

      // 4. Create in database
      const campaign = await this.repository.create({
        ...validatedData,
        workspace_id: context.workspaceId,
        created_by: context.userId
      })

      return campaign
    } catch (error) {
      throw error
    }
  }

  /**
   * Update campaign
   */
  async updateCampaign(
    context: RequestContext,
    campaignId: string,
    data: UpdateCampaignDTO
  ): Promise<CampaignDTO> {
    try {
      // 1. Validate input
      const validatedData = UpdateCampaignSchema.parse(data)

      // 2. Check permissions
      if (context.userRole === 'viewer') {
        throw new ForbiddenError('Viewers cannot update campaigns')
      }

      // 3. Get existing campaign
      const campaign = await this.repository.findById(campaignId)
      if (!campaign) {
        throw new NotFoundError('Campaign')
      }

      // 4. Check workspace isolation
      if (campaign.workspace_id !== context.workspaceId) {
        throw new ForbiddenError('Cannot access campaigns from other workspaces')
      }

      // 5. Update in database
      const updated = await this.repository.update(campaignId, validatedData)
      if (!updated) throw new NotFoundError('Campaign')

      return updated
    } catch (error) {
      throw error
    }
  }

  /**
   * Get campaign
   */
  async getCampaign(
    context: RequestContext,
    campaignId: string
  ): Promise<CampaignDTO> {
    try {
      const campaign = await this.repository.findById(campaignId)

      if (!campaign) {
        throw new NotFoundError('Campaign')
      }

      // Verify workspace isolation
      if (campaign.workspace_id !== context.workspaceId) {
        throw new ForbiddenError('Cannot access campaigns from other workspaces')
      }

      return campaign
    } catch (error) {
      throw error
    }
  }

  /**
   * Delete campaign
   */
  async deleteCampaign(
    context: RequestContext,
    campaignId: string
  ): Promise<void> {
    try {
      // Only admins can delete
      if (context.userRole !== 'admin') {
        throw new ForbiddenError('Only admins can delete campaigns')
      }

      const campaign = await this.repository.findById(campaignId)
      if (!campaign) {
        throw new NotFoundError('Campaign')
      }

      // Verify workspace isolation
      if (campaign.workspace_id !== context.workspaceId) {
        throw new ForbiddenError('Cannot access campaigns from other workspaces')
      }

      await this.repository.delete(campaignId)
    } catch (error) {
      throw error
    }
  }

  /**
   * List campaigns in workspace
   */
  async listCampaigns(
    context: RequestContext,
    page: number = 1,
    pageSize: number = 20
  ): Promise<any> {
    try {
      const offset = (page - 1) * pageSize

      const result = await this.repository.paginate(
        {
          workspace_id: context.workspaceId,
          is_archived: false
        },
        { limit: pageSize, offset }
      )

      return {
        data: result.data,
        pagination: {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
          totalPages: Math.ceil(result.total / result.pageSize),
          hasMore: result.hasMore
        }
      }
    } catch (error) {
      throw error
    }
  }

  // Add more methods as needed...
}
```

**Key Principles**:
- ✅ Validate all inputs with Zod schemas
- ✅ Check permissions based on role
- ✅ Verify workspace isolation
- ✅ Handle all errors properly
- ✅ Call repository methods
- ✅ Return DTOs (not raw database objects)

---

### 5️⃣ CREATE API ROUTES

**File**: `src/app/api/campaigns/route.ts` (List & Create)

```typescript
import { NextRequest } from 'next/server'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  paginatedResponse
} from '@/core/middleware/responseHandler'
import {
  createRequestContext,
  generateRequestId,
  extractRequestMetadata,
  requireEditor
} from '@/core/middleware/auth'
import { CampaignService } from '@/services/CampaignService'
import { CreateCampaignSchema } from '@/lib/validation/schemas'
import { ZodError } from 'zod'

/**
 * GET /api/campaigns
 * List campaigns in current workspace
 *
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 *
 * Response:
 * {
 *   "success": true,
 *   "data": [...],
 *   "pagination": { ... }
 * }
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()
  const { ip, userAgent } = extractRequestMetadata(request)

  try {
    // Extract pagination params
    const url = new URL(request.url)
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20')))

    // Authenticate
    const context = await createRequestContext(requestId, ip, userAgent)

    // Get campaigns
    const campaignService = new CampaignService()
    const result = await campaignService.listCampaigns(context, page, limit)

    // Return paginated response
    return paginatedResponse(
      result.data,
      result.pagination.page,
      result.pagination.pageSize,
      result.pagination.total
    )
  } catch (error) {
    return errorResponse(error, requestId)
  }
}

/**
 * POST /api/campaigns
 * Create new campaign
 *
 * Authentication: Required
 * Authorization: Editor or Admin
 *
 * Request Body:
 * {
 *   "name": "Q4 Social Push",
 *   "description": "Holiday campaign",
 *   "goal": "Increase brand awareness",
 *   "color": "#FF5733",
 *   "start_date": "2025-11-06T00:00:00Z",
 *   "end_date": "2025-12-31T23:59:59Z"
 * }
 */
export async function POST(request: NextRequest) {
  const requestId = generateRequestId()
  const { ip, userAgent } = extractRequestMetadata(request)

  try {
    // Authenticate and check permissions
    const context = await createRequestContext(requestId, ip, userAgent)
    requireEditor(context) // Only editors and admins

    // Parse and validate request
    const body = await request.json()
    const validatedData = CreateCampaignSchema.parse(body)

    // Create campaign
    const campaignService = new CampaignService()
    const campaign = await campaignService.createCampaign(context, validatedData)

    return successResponse(campaign, 201)
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error, requestId)
    }
    return errorResponse(error, requestId)
  }
}
```

**File**: `src/app/api/campaigns/[id]/route.ts` (Get, Update, Delete)

```typescript
import { NextRequest } from 'next/server'
import {
  successResponse,
  errorResponse,
  validationErrorResponse
} from '@/core/middleware/responseHandler'
import {
  createRequestContext,
  generateRequestId,
  extractRequestMetadata,
  requireEditor
} from '@/core/middleware/auth'
import { CampaignService } from '@/services/CampaignService'
import { UpdateCampaignSchema } from '@/lib/validation/schemas'
import { ZodError } from 'zod'

/**
 * GET /api/campaigns/[id]
 * Get campaign details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId()
  const { ip, userAgent } = extractRequestMetadata(request)

  try {
    const context = await createRequestContext(requestId, ip, userAgent)
    const campaignService = new CampaignService()
    const campaign = await campaignService.getCampaign(context, params.id)

    return successResponse(campaign, 200)
  } catch (error) {
    return errorResponse(error, requestId)
  }
}

/**
 * PATCH /api/campaigns/[id]
 * Update campaign (editor+)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId()
  const { ip, userAgent } = extractRequestMetadata(request)

  try {
    const context = await createRequestContext(requestId, ip, userAgent)
    requireEditor(context)

    const body = await request.json()
    const validatedData = UpdateCampaignSchema.parse(body)

    const campaignService = new CampaignService()
    const updated = await campaignService.updateCampaign(
      context,
      params.id,
      validatedData
    )

    return successResponse(updated, 200)
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error, requestId)
    }
    return errorResponse(error, requestId)
  }
}

/**
 * DELETE /api/campaigns/[id]
 * Delete campaign (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId()
  const { ip, userAgent } = extractRequestMetadata(request)

  try {
    const context = await createRequestContext(requestId, ip, userAgent)
    const campaignService = new CampaignService()
    await campaignService.deleteCampaign(context, params.id)

    return successResponse({ message: 'Campaign deleted successfully' }, 200)
  } catch (error) {
    return errorResponse(error, requestId)
  }
}
```

---

## 🎯 Complete Checklist for New Feature

- [ ] **Define DTOs** in `src/core/types/DTOs.ts`
- [ ] **Create Zod Schema** in `src/lib/validation/schemas.ts`
- [ ] **Create Repository** in `src/core/database/repositories/YourRepository.ts`
  - [ ] Implement all abstract methods
  - [ ] Add custom methods as needed
  - [ ] Error handling with DatabaseError
- [ ] **Create Service** in `src/services/YourService.ts`
  - [ ] Validate inputs with schemas
  - [ ] Check permissions
  - [ ] Verify workspace isolation
  - [ ] Call repository methods
  - [ ] Return DTOs
- [ ] **Create API Routes** in `src/app/api/your-resource/route.ts`
  - [ ] Extract pagination params
  - [ ] Create request context
  - [ ] Check permissions
  - [ ] Validate request body
  - [ ] Call service methods
  - [ ] Return consistent responses

---

## 🔒 Permission Checking

Always verify permissions in this order:

```typescript
// 1. Check user is authenticated (automatic in createRequestContext)
const context = await createRequestContext(requestId, ip, userAgent)

// 2. Check role
if (context.userRole !== 'admin') {
  throw new ForbiddenError('Admin required')
}

// 3. Check workspace isolation
if (resource.workspace_id !== context.workspaceId) {
  throw new ForbiddenError('Cannot access resource from other workspace')
}

// 4. Check specific permissions (if needed)
if (!canUserAccess(resource, context)) {
  throw new ForbiddenError('Cannot access this resource')
}
```

---

## 📝 Error Handling

Always use the correct error type:

```typescript
// Validation errors
throw new ValidationError('Invalid email format')

// Authentication errors
throw new UnauthorizedError('Session expired')

// Authorization errors
throw new ForbiddenError('Admin required')

// Resource not found
throw new NotFoundError('Campaign')

// Conflict (duplicate, etc.)
throw new ConflictError('Campaign name already exists')

// Database errors
throw new DatabaseError('Failed to fetch campaigns', { error })

// External API errors
throw new ExternalAPIError('Gemini', 'Rate limit exceeded')

// OAuth errors
throw new OAuthError('Twitter', 'Invalid credentials')
```

---

## 🧪 Testing Your Feature

```bash
# Test GET
curl http://localhost:3000/api/campaigns \
  -H "Authorization: Bearer TOKEN"

# Test POST
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "Q4 Campaign",
    "description": "Holiday sales"
  }'

# Test PATCH
curl -X PATCH http://localhost:3000/api/campaigns/abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{ "name": "Updated Name" }'

# Test DELETE
curl -X DELETE http://localhost:3000/api/campaigns/abc123 \
  -H "Authorization: Bearer TOKEN"
```

---

## 📚 File Organization

```
src/
├── core/
│   ├── database/
│   │   ├── Repository.ts (base class)
│   │   └── repositories/
│   │       ├── UserRepository.ts ✅
│   │       ├── WorkspaceRepository.ts ✅
│   │       ├── CampaignRepository.ts (follow pattern)
│   │       ├── PostRepository.ts (follow pattern)
│   │       └── ...
│   ├── errors/
│   │   └── AppError.ts ✅
│   ├── middleware/
│   │   ├── auth.ts ✅
│   │   └── responseHandler.ts ✅
│   └── types/
│       └── DTOs.ts ✅
├── lib/
│   └── validation/
│       └── schemas.ts ✅
├── services/
│   ├── WorkspaceService.ts ✅
│   ├── UserService.ts ✅
│   ├── CampaignService.ts (follow pattern)
│   ├── PostService.ts (follow pattern)
│   └── ...
└── app/api/
    ├── workspace/ (follow pattern)
    │   └── route.ts ✅
    ├── campaigns/ (follow pattern)
    │   ├── route.ts
    │   └── [id]/route.ts
    ├── posts/
    │   ├── route.ts
    │   └── [id]/route.ts
    └── ...
```

---

## ✅ Implementation Complete

You now have:
- ✅ **Type-Safe DTOs** - Consistent data types
- ✅ **Validation Schemas** - Zod validation at boundaries
- ✅ **Repository Pattern** - Database abstraction
- ✅ **Service Layer** - Business logic centralization
- ✅ **API Routes** - HTTP handlers with error handling
- ✅ **Middleware** - Authentication, authorization, error handling
- ✅ **Error Classes** - Consistent error handling

**Every new feature follows the same 5-step pattern above.**

---

## 🚀 Next Features to Implement

1. **Posts Management** - Create, read, update, delete posts
2. **Media Management** - Upload, tag, organize media
3. **Platform Integration** - OAuth, credential storage
4. **Scheduling** - Schedule posts for future publishing
5. **Analytics** - Track performance metrics
6. **Approval Workflow** - Content approval system
7. **A/B Testing** - Test different content
8. **Search & Filtering** - Find posts by criteria

**Each follows the exact same pattern shown above!**

---

**Last Updated**: 2025-11-06
**Pattern**: 5-Layer Clean Architecture
**Status**: Ready for feature implementation
