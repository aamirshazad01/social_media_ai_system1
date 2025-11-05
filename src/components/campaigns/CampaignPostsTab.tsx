/**
 * Campaign Posts Tab
 * Manage posts within a campaign - view, schedule, add, remove
 */

'use client'

import React, { useState } from 'react'
import { Campaign, Post } from '@/types'
import { Plus, Calendar, ExternalLink, Trash2, Clock } from 'lucide-react'

interface CampaignPostsTabProps {
  campaign: Campaign
  posts: Post[]
  allPosts: Post[]
  onUpdatePost?: (post: Post) => void
  onCreatePost?: (post: Post) => void
}

export default function CampaignPostsTab({
  campaign,
  posts,
  allPosts,
  onUpdatePost,
  onCreatePost
}: CampaignPostsTabProps) {
  const [showAddPosts, setShowAddPosts] = useState(false)

  const unassignedPosts = allPosts.filter(p => !p.campaignId)

  const addPostToCampaign = (post: Post) => {
    if (onUpdatePost) {
      onUpdatePost({ ...post, campaignId: campaign.id })
    }
  }

  const removePostFromCampaign = (post: Post) => {
    if (confirm('Remove this post from the campaign?')) {
      if (onUpdatePost) {
        const updated = { ...post }
        delete (updated as any).campaignId
        onUpdatePost(updated)
      }
    }
  }

  const createQuickDraft = () => {
    if (onCreatePost) {
      const draft: Post = {
        id: crypto.randomUUID(),
        topic: `Draft for ${campaign.name}`,
        platforms: [],
        content: {},
        status: 'draft',
        createdAt: new Date().toISOString(),
        campaignId: campaign.id,
        isGeneratingImage: false,
        isGeneratingVideo: false,
        videoGenerationStatus: ''
      } as Post
      onCreatePost(draft)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200'
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'approved': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Campaign Posts</h3>
          <p className="text-sm text-gray-600">{posts.length} posts in this campaign</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddPosts(!showAddPosts)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors"
          >
            Add Existing Posts
          </button>
          <button
            onClick={createQuickDraft}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Draft
          </button>
        </div>
      </div>

      {/* Add Posts Section */}
      {showAddPosts && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Add Posts to Campaign</h4>
          {unassignedPosts.length === 0 ? (
            <p className="text-gray-600 text-sm">No unassigned posts available</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {unassignedPosts.map(post => (
                <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 line-clamp-1">{post.topic}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                      {post.platforms.length > 0 && (
                        <span className="text-xs text-gray-600">
                          {post.platforms.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => addPostToCampaign(post)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm transition-colors"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-4">Create posts and assign them to this campaign</p>
          <button
            onClick={createQuickDraft}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create First Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{post.topic}</h4>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                    
                    {post.platforms.length > 0 && (
                      <div className="flex items-center gap-1">
                        {post.platforms.map(platform => (
                          <span key={platform} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            {platform}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {post.scheduledAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Scheduled: {new Date(post.scheduledAt).toLocaleString()}</span>
                      </div>
                    )}
                    {post.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Published: {new Date(post.publishedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {post.analytics && (
                    <div className="mt-3 grid grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-2">
                        <div className="text-lg font-bold text-blue-900">{post.analytics.reach.toLocaleString()}</div>
                        <div className="text-xs text-blue-700">Reach</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2">
                        <div className="text-lg font-bold text-green-900">{post.analytics.engagement.toLocaleString()}</div>
                        <div className="text-xs text-green-700">Engagement</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-2">
                        <div className="text-lg font-bold text-purple-900">{post.analytics.impressions.toLocaleString()}</div>
                        <div className="text-xs text-purple-700">Impressions</div>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-2">
                        <div className="text-lg font-bold text-indigo-900">{post.analytics.clicks.toLocaleString()}</div>
                        <div className="text-xs text-indigo-700">Clicks</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Post"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => removePostFromCampaign(post)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from Campaign"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
