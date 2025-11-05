/**
 * A/B Testing Tab
 * Create and manage A/B tests for campaign posts
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Campaign, Post } from '@/types'
import type { ABTest } from '@/services/campaign/abTestingService'
import { FlaskConical, Plus, TrendingUp, Award, AlertCircle, Play, CheckCircle } from 'lucide-react'

interface ABTestingTabProps {
  campaign: Campaign
  posts: Post[]
}

export default function ABTestingTab({ campaign, posts }: ABTestingTabProps) {
  const [tests, setTests] = useState<ABTest[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    loadTests()
  }, [campaign.id])

  const loadTests = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/campaigns/${campaign.id}/ab-tests`)
      if (res.ok) {
        const data = await res.json()
        setTests(data)
      }
    } catch (error) {
      console.error('Error loading A/B tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const publishedPosts = posts.filter(p => p.status === 'published')

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-600" />
            A/B Tests
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Compare post variations to optimize performance
          </p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          disabled={publishedPosts.length < 2}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          New A/B Test
        </button>
      </div>

      {/* Tests List */}
      {tests.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <FlaskConical className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No A/B Tests Yet</h3>
          <p className="text-gray-600 mb-4">
            Create tests to compare different post variations and find what works best
          </p>
          {publishedPosts.length < 2 ? (
            <p className="text-sm text-yellow-600">
              ⚠️ You need at least 2 published posts to create an A/B test
            </p>
          ) : (
            <button
              onClick={() => setShowCreateDialog(true)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Your First Test
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {tests.map(test => (
            <ABTestCard key={test.id} test={test} posts={posts} onRefresh={loadTests} />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      {showCreateDialog && (
        <CreateABTestDialog
          campaign={campaign}
          posts={publishedPosts}
          onClose={() => setShowCreateDialog(false)}
          onCreated={() => {
            setShowCreateDialog(false)
            loadTests()
          }}
        />
      )}
    </div>
  )
}

function ABTestCard({ test, posts, onRefresh }: { test: ABTest; posts: Post[]; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false)

  const controlPost = posts.find(p => p.id === test.controlPostId)
  const variantPosts = posts.filter(p => test.variantPostIds.includes(p.id))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const startTest = async () => {
    try {
      const res = await fetch(`/api/campaigns/${test.campaignId}/ab-tests/${test.id}/start`, {
        method: 'POST'
      })
      if (res.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error('Error starting test:', error)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-gray-900">{test.name}</h4>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(test.status)}`}>
              {test.status}
            </span>
          </div>
          <p className="text-sm text-gray-600">{test.hypothesis}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="capitalize">Type: {test.variationType}</span>
            {test.startDate && (
              <span>Started: {new Date(test.startDate).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        {test.status === 'draft' && (
          <button
            onClick={startTest}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Play className="w-4 h-4" />
            Start Test
          </button>
        )}
      </div>

      {/* Results Preview */}
      {test.status === 'completed' && test.results && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-900">Test Results</span>
            <span className="text-sm text-gray-600">
              ({test.confidenceLevel}% confidence)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-600 mb-1">Control</div>
              <div className="text-lg font-bold text-gray-900">
                {test.results.control.engagementRate.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-600">Engagement Rate</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-xs text-purple-600 mb-1">Best Variant</div>
              <div className="text-lg font-bold text-purple-900">
                {Math.max(...test.results.variants.map(v => v.engagementRate)).toFixed(2)}%
              </div>
              <div className="text-xs text-purple-600">Engagement Rate</div>
            </div>
          </div>

          {test.results.recommendation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">{test.results.recommendation}</p>
            </div>
          )}
        </div>
      )}

      {/* Expand for details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-4"
      >
        {expanded ? 'Hide Details' : 'View Details'}
      </button>

      {expanded && (
        <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Control Post</h5>
            {controlPost && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-900 font-medium">{controlPost.topic}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {controlPost.platforms.join(', ')}
                </p>
              </div>
            )}
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-2">Variants ({variantPosts.length})</h5>
            <div className="space-y-2">
              {variantPosts.map((post, idx) => (
                <div key={post.id} className="bg-purple-50 rounded-lg p-3">
                  <p className="text-sm text-gray-900 font-medium">
                    Variant {String.fromCharCode(65 + idx)}: {post.topic}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {post.platforms.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CreateABTestDialog({
  campaign,
  posts,
  onClose,
  onCreated
}: {
  campaign: Campaign
  posts: Post[]
  onClose: () => void
  onCreated: () => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    hypothesis: '',
    variationType: 'caption' as ABTest['variationType'],
    controlPostId: '',
    variantPostIds: [] as string[]
  })
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.controlPostId || formData.variantPostIds.length === 0) {
      alert('Please fill in all required fields')
      return
    }

    setCreating(true)

    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/ab-tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        onCreated()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create test')
      }
    } catch (error) {
      console.error('Error creating test:', error)
      alert('Failed to create test')
    } finally {
      setCreating(false)
    }
  }

  const toggleVariant = (postId: string) => {
    setFormData(prev => ({
      ...prev,
      variantPostIds: prev.variantPostIds.includes(postId)
        ? prev.variantPostIds.filter(id => id !== postId)
        : [...prev.variantPostIds, postId]
    }))
  }

  const availablePosts = posts.filter(p => p.id !== formData.controlPostId)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Create A/B Test</h3>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Test Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Caption Variation Test"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Hypothesis
              </label>
              <textarea
                value={formData.hypothesis}
                onChange={(e) => setFormData({ ...formData, hypothesis: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="e.g., Shorter captions will increase engagement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Variation Type
              </label>
              <select
                value={formData.variationType}
                onChange={(e) => setFormData({ ...formData, variationType: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="caption">Caption</option>
                <option value="image">Image</option>
                <option value="cta">Call-to-Action</option>
                <option value="timing">Timing</option>
                <option value="platform">Platform</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Control Post *
              </label>
              <select
                value={formData.controlPostId}
                onChange={(e) => setFormData({ ...formData, controlPostId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 bg-white"
                required
              >
                <option value="">Select control post...</option>
                {posts.map(post => (
                  <option key={post.id} value={post.id}>
                    {post.topic}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Variant Posts * (Select at least 1)
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {availablePosts.map(post => (
                  <label key={post.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.variantPostIds.includes(post.id)}
                      onChange={() => toggleVariant(post.id)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-900">{post.topic}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 font-medium text-white disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
