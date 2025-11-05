/**
 * Campaign Manager - Main Component
 * Enterprise-grade campaign management system
 */

'use client'

import React, { useState } from 'react'
import { Plus, Download, Filter, Search } from 'lucide-react'
import { useCampaigns } from '@/hooks/useCampaigns'
import { Campaign, Post } from '@/types'
import CampaignList from './CampaignList'
import CreateCampaignDialog from './CreateCampaignDialog'
import CampaignDetailModal from './CampaignDetailModal'

interface CampaignManagerProps {
  posts: Post[]
  onUpdatePost?: (post: Post) => void
  onCreatePost?: (post: Post) => void
}

export default function CampaignManagerNew({
  posts,
  onUpdatePost,
  onCreatePost
}: CampaignManagerProps) {
  const { campaigns, loading, error, createCampaign, updateCampaign, deleteCampaign } = useCampaigns()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateCampaign = async (data: Partial<Campaign>) => {
    await createCampaign(data)
  }

  const handleDeleteCampaign = async (id: string) => {
    if (confirm('Are you sure you want to delete this campaign? Posts will not be deleted.')) {
      await deleteCampaign(id)
      if (selectedCampaign?.id === id) {
        setSelectedCampaign(null)
      }
    }
  }

  const handleUpdateCampaign = async (id: string, updates: Partial<Campaign>) => {
    const updated = await updateCampaign(id, updates)
    if (updated && selectedCampaign?.id === id) {
      setSelectedCampaign(updated)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-md">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
              <p className="text-gray-600 text-sm mt-1">Organize and track your marketing campaigns</p>
            </div>
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md transition-all transform hover:scale-105 active:scale-95 hover:shadow-lg min-w-[150px]"
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 transition-all transform hover:scale-105 hover:shadow-md cursor-pointer">
              <div className="text-2xl font-bold text-blue-900">{campaigns.length}</div>
              <div className="text-sm text-blue-700">Total Campaigns</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 transition-all transform hover:scale-105 hover:shadow-md cursor-pointer">
              <div className="text-2xl font-bold text-green-900">
                {campaigns.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-green-700">Active</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 transition-all transform hover:scale-105 hover:shadow-md cursor-pointer">
              <div className="text-2xl font-bold text-purple-900">
                {campaigns.filter(c => c.status === 'planning').length}
              </div>
              <div className="text-sm text-purple-700">Planning</div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 transition-all transform hover:scale-105 hover:shadow-md cursor-pointer">
              <div className="text-2xl font-bold text-gray-900">
                {campaigns.filter(c => c.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-700">Completed</div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-4 mt-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Export */}
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium text-gray-700 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">Error loading campaigns</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        <CampaignList
          campaigns={filteredCampaigns}
          onSelectCampaign={setSelectedCampaign}
          onDeleteCampaign={handleDeleteCampaign}
          loading={loading}
        />

        {filteredCampaigns.length === 0 && !loading && searchQuery && (
          <div className="text-center py-12">
            <p className="text-gray-600">No campaigns found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <CreateCampaignDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreate={handleCreateCampaign}
      />

      {/* Campaign Detail Modal */}
      <CampaignDetailModal
        campaign={selectedCampaign}
        posts={posts}
        onClose={() => setSelectedCampaign(null)}
        onUpdateCampaign={handleUpdateCampaign}
        onUpdatePost={onUpdatePost}
        onCreatePost={onCreatePost}
      />
    </div>
  )
}
