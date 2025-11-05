/**
 * TikTok - Upload Media
 * POST /api/tiktok/upload-media
 *
 * Body: {
 *   videoData: string, // base64 encoded video or public URL
 * }
 *
 * Returns: { videoUrl: string, videoSize: number }
 *
 * Note: TikTok accepts public URLs for videos
 * This endpoint uploads to Supabase Storage and returns the public URL
 * Follows the same pattern as /api/facebook/upload-media
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { CredentialService } from '@/services/database'
import { TikTokCredentials } from '@/types'

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get workspace_id
    const { data: userData } = await supabase
      .from('users')
      .select('workspace_id')
      .eq('id', user.id)
      .maybeSingle<{ workspace_id: string }>()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get request body
    const body = await req.json()
    const { videoData } = body

    if (!videoData) {
      return NextResponse.json(
        { error: 'videoData is required' },
        { status: 400 }
      )
    }

    // Get TikTok credentials from database
    const credentialService = new CredentialService(supabase)
    const credentials = await credentialService.getPlatformCredentials(
      userData.workspace_id,
      'tiktok'
    )

    if (!credentials || !('accessToken' in credentials)) {
      return NextResponse.json({ error: 'TikTok not connected' }, { status: 400 })
    }
    const tikTokCreds = credentials as TikTokCredentials

    // Check if token is expired
    if (tikTokCreds.expiresAt && new Date(tikTokCreds.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Access token expired. Please reconnect.' },
        { status: 400 }
      )
    }

    // If it's already a public URL, return it directly
    if (videoData.startsWith('http')) {
      return NextResponse.json({
        success: true,
        videoUrl: videoData,
        videoSize: 0,
      })
    }

    // Convert base64 to Buffer
    const base64Data = videoData.replace(/^data:video\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Validate file size (max 287MB for TikTok, but we'll limit to 100MB for practical reasons)
    const MAX_SIZE = 100 * 1024 * 1024; // 100MB
    if (buffer.length > MAX_SIZE) {
      return NextResponse.json(
        { error: `Video size exceeds ${MAX_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileName = `tiktok_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('media')
      .upload(fileName, buffer, {
        contentType: 'video/mp4',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      throw new Error(`Failed to upload to storage: ${uploadError.message}`)
    }

    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('media')
      .getPublicUrl(fileName)

    if (!publicUrlData.publicUrl) {
      throw new Error('Failed to get public URL')
    }

    // Return the public URL
    return NextResponse.json({
      success: true,
      videoUrl: publicUrlData.publicUrl,
      videoSize: buffer.length,
      fileName: fileName,
    })
  } catch (error) {
    // Handle errors
    const errorMessage = (error as any).message || 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to upload media',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
