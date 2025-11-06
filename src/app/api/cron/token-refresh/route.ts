/**
 * Token Refresh Cron Job
 * GET /api/cron/token-refresh
 *
 * This endpoint should be called hourly by a cron service (e.g., vercel/node-cron)
 * Refreshes all credentials that are approaching expiration
 *
 * Setup instructions:
 *
 * OPTION 1: Vercel Cron Functions
 * - Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/token-refresh",
 *     "schedule": "0 * * * *"  // Every hour
 *   }]
 * }
 *
 * OPTION 2: External Service (e.g., EasyCron, GitHub Actions)
 * - Schedule HTTP GET to: https://yourdomain.com/api/cron/token-refresh?secret=YOUR_SECRET
 *
 * OPTION 3: Self-hosted (Node.js node-cron)
 * - See bottom of this file for setup code
 */

import { NextRequest, NextResponse } from 'next/server'

// Lazy-load services to avoid instantiation errors at build time
let tokenRefreshService: any
let oauthStateService: any

async function getServices() {
  if (!tokenRefreshService || !oauthStateService) {
    const { TokenRefreshService } = await import('@/services/TokenRefreshService')
    const { OAuthStateService } = await import('@/services/OAuthStateService')
    tokenRefreshService = new TokenRefreshService()
    oauthStateService = new OAuthStateService()
  }
  return { tokenRefreshService, oauthStateService }
}

// Verify cron secret to prevent unauthorized calls
function verifyCronSecret(secret: string | null): boolean {
  const validSecret = process.env.CRON_SECRET
  if (!validSecret) {
    console.warn('⚠️ CRON_SECRET not configured, accepting all requests')
    return true
  }
  return secret === validSecret
}

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const secret = req.nextUrl.searchParams.get('secret')

    if (!verifyCronSecret(secret)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🔄 Starting hourly token refresh job...')

    // Get services
    const { tokenRefreshService: trs, oauthStateService: oss } = await getServices()

    // ✅ Task 1: Refresh all expired tokens
    console.log('📋 Task 1: Refreshing expired tokens')
    const refreshResult = await trs.refreshAllExpiredTokens()
    console.log(`✅ Refresh result: ${refreshResult.successful}/${refreshResult.total} successful, ${refreshResult.failed} failed`)

    // ✅ Task 2: Clean up expired OAuth states
    console.log('📋 Task 2: Cleaning up expired OAuth states')
    const cleanupCount = await oss.cleanupExpiredStates()
    console.log(`✅ Cleaned up ${cleanupCount} expired OAuth states`)

    // ✅ Task 3: Return summary
    const summary = {
      success: true,
      timestamp: new Date().toISOString(),
      tasks: {
        tokenRefresh: {
          total: refreshResult.total,
          successful: refreshResult.successful,
          failed: refreshResult.failed,
        },
        oauthStateCleanup: {
          cleaned: cleanupCount,
        },
      },
    }

    console.log('✅ Cron job completed successfully')
    return NextResponse.json(summary, { status: 200 })
  } catch (error) {
    console.error('❌ Cron job failed:', error)
    return NextResponse.json(
      {
        error: 'Cron job failed',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

/**
 * OPTION 3 SETUP: Self-hosted Node.js with node-cron
 *
 * Install: npm install node-cron
 *
 * Add to your server startup (e.g., middleware.ts or separate cron-server.js):
 *
 * import cron from 'node-cron'
 *
 * // Run every hour at minute 0
 * cron.schedule('0 * * * *', async () => {
 *   try {
 *     const response = await fetch('http://localhost:3000/api/cron/token-refresh?secret=your_secret', {
 *       method: 'GET',
 *     })
 *     const data = await response.json()
 *     console.log('Cron job result:', data)
 *   } catch (error) {
 *     console.error('Cron job error:', error)
 *   }
 * })
 *
 * For production with Vercel, use OPTION 1 (Vercel Crons)
 */
