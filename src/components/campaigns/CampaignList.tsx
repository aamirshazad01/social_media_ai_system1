/**
 * Campaign List Component
 * Displays all campaigns in a professional grid layout
 */

'use client'

import React from 'react'
import { Campaign } from '@/types'
import { Calendar, Target, TrendingUp, Users, MoreVertical } from 'lucide-react'

interface CampaignListProps {
  campaigns: Campaign[]
  onSelectCampaign: (campaign: Campaign) => void
  onDeleteCampaign: (id: string) => void
  loading?: boolean
}

export default function CampaignList({
  campaigns,
  onSelectCampaign,
  onDeleteCampaign,
  loading = false
}: CampaignListProps) {
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null)

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'awareness': return <TrendingUp className="w-4 h-4" />
      case 'engagement': return <Users className="w-4 h-4" />
      case 'conversion': return <Target className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Create your first campaign to organize your content strategy and track performance
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map(campaign => {
        const daysRemaining = campaign.endDate
          ? Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : null

        return (
          <div
            key={campaign.id}
            className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
            onClick={() => onSelectCampaign(campaign)}
          >
            {/* Color accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: campaign.color }}
            />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {campaign.name}
                  </h3>
                  {campaign.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {campaign.description}
                    </p>
                  )}
                </div>

                {/* Actions menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveMenu(activeMenu === campaign.id ? null : campaign.id)
                    }}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>

                  {activeMenu === campaign.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteCampaign(campaign.id)
                          setActiveMenu(null)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete Campaign
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                  {campaign.status || 'planning'}
                </span>
                
                {campaign.campaignType && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {getTypeIcon(campaign.campaignType)}
                    {campaign.campaignType}
                  </span>
                )}

                {daysRemaining !== null && daysRemaining >= 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                    <Calendar className="w-3 h-3" />
                    {daysRemaining}d left
                  </span>
                )}
              </div>

              {/* Date range */}
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {campaign.endDate && (
                  <>
                    <span className="mx-2">→</span>
                    {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </>
                )}
              </div>

              {/* Goals preview */}
              {campaign.goals && campaign.goals.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center text-xs font-medium text-gray-500 mb-2">
                    <Target className="w-3.5 h-3.5 mr-1.5" />
                    GOALS ({campaign.goals.length})
                  </div>
                  <div className="space-y-1">
                    {campaign.goals.slice(0, 2).map((goal, idx) => (
                      <div key={idx} className="flex items-start">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-1.5 mr-2 flex-shrink-0"
                          style={{ backgroundColor: campaign.color }}
                        />
                        <p className="text-sm text-gray-700 line-clamp-1">{goal}</p>
                      </div>
                    ))}
                    {campaign.goals.length > 2 && (
                      <p className="text-xs text-gray-500 ml-3.5">
                        +{campaign.goals.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
