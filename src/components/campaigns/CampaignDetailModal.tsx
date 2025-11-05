/**
 * Campaign Detail Modal
 * Comprehensive campaign view with tabs for analytics, posts, calendar, settings
 */

'use client'

import React, { useState } from 'react'
import { Campaign, Post } from '@/types'
import { useCampaignAnalytics } from '@/hooks/useCampaignAnalytics'
import {
  X, TrendingUp, Calendar, Settings, FileText, Users,
  Download, Play, Pause, Archive, BarChart3, Target, Lightbulb
} from 'lucide-react'
import CampaignAnalyticsDashboard from './CampaignAnalyticsDashboard'
import CampaignPostsTab from './CampaignPostsTab'
import CampaignSettingsTab from './CampaignSettingsTab'
import ABTestingTab from './ABTestingTab'
import { CampaignExportService } from '@/services/campaign/campaignExport'

interface CampaignDetailModalProps {
  campaign: Campaign | null
  posts: Post[]
  onClose: () => void
  onUpdateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>
  onUpdatePost?: (post: Post) => void
  onCreatePost?: (post: Post) => void
}

type TabType = 'overview' | 'posts' | 'ab-testing' | 'calendar' | 'settings'

export default function CampaignDetailModal({
  campaign,
  posts,
  onClose,
  onUpdateCampaign,
  onUpdatePost,
  onCreatePost
}: CampaignDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const { analytics, loading: analyticsLoading, refresh } = useCampaignAnalytics(campaign?.id || null)

  if (!campaign) return null

  const campaignPosts = posts.filter(p => p.campaignId === campaign.id)

  const togglePause = async () => {
    const newStatus = campaign.status === 'paused' ? 'active' : 'paused'
    await onUpdateCampaign(campaign.id, { status: newStatus })
    refresh()
  }

  const archiveCampaign = async () => {
    if (confirm('Archive this campaign? You can restore it later.')) {
      await onUpdateCampaign(campaign.id, { archived: true })
      onClose()
    }
  }

  const exportCsv = () => {
    CampaignExportService.exportToCsv(campaign, campaignPosts)
  }

  const exportPdf = () => {
    if (analytics) {
      CampaignExportService.exportToHtmlReport(campaign, analytics)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'posts', label: 'Posts', icon: FileText, count: campaignPosts.length },
    { id: 'ab-testing', label: 'A/B Testing', icon: Lightbulb },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6">
          {/* Color accent */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: campaign.color }}
          />

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">{campaign.name}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  campaign.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                  campaign.status === 'paused' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                  campaign.status === 'completed' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                }`}>
                  {campaign.status || 'planning'}
                </span>
              </div>
              
              {campaign.description && (
                <p className="text-gray-300 max-w-3xl">{campaign.description}</p>
              )}

              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {campaign.endDate && (
                      <> → {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</>
                    )}
                  </span>
                </div>

                {campaign.campaignType && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Target className="w-4 h-4" />
                    <span className="text-sm capitalize">{campaign.campaignType}</span>
                  </div>
                )}

                {analytics && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Health: {analytics.healthScore}/100</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={togglePause}
                className="p-2.5 hover:bg-white/10 rounded-lg transition-colors"
                title={campaign.status === 'paused' ? 'Resume' : 'Pause'}
              >
                {campaign.status === 'paused' ? (
                  <Play className="w-5 h-5 text-white" />
                ) : (
                  <Pause className="w-5 h-5 text-white" />
                )}
              </button>

              <button
                onClick={exportCsv}
                className="p-2.5 hover:bg-white/10 rounded-lg transition-colors"
                title="Export CSV"
              >
                <Download className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={archiveCampaign}
                className="p-2.5 hover:bg-white/10 rounded-lg transition-colors"
                title="Archive"
              >
                <Archive className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={onClose}
                className="p-2.5 hover:bg-white/10 rounded-lg transition-colors ml-2"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-6 border-b border-white/10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-3 relative transition-colors ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-2 py-0.5 text-xs bg-white/10 rounded-full">
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: campaign.color }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-8">
            {activeTab === 'overview' && (
              <CampaignAnalyticsDashboard
                campaign={campaign}
                analytics={analytics}
                loading={analyticsLoading}
                onRefresh={refresh}
                onExportPdf={exportPdf}
              />
            )}

            {activeTab === 'posts' && (
              <CampaignPostsTab
                campaign={campaign}
                posts={campaignPosts}
                allPosts={posts}
                onUpdatePost={onUpdatePost}
                onCreatePost={onCreatePost}
              />
            )}

            {activeTab === 'ab-testing' && (
              <ABTestingTab
                campaign={campaign}
                posts={campaignPosts}
              />
            )}

            {activeTab === 'calendar' && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Calendar view coming soon</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <CampaignSettingsTab
                campaign={campaign}
                onUpdate={onUpdateCampaign}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
