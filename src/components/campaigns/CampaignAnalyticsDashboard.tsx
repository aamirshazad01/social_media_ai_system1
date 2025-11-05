/**
 * Campaign Analytics Dashboard
 * Visual analytics with charts, insights, and metrics
 */

'use client'

import React from 'react'
import { Campaign } from '@/types'
import type { CampaignAnalytics } from '@/services/campaign/campaignAnalytics'
import {
  TrendingUp, TrendingDown, Minus, Target, AlertTriangle,
  CheckCircle, Info, Zap, Users, Eye, MousePointer, BarChart3, FileText
} from 'lucide-react'

interface CampaignAnalyticsDashboardProps {
  campaign: Campaign
  analytics: CampaignAnalytics | null
  loading: boolean
  onRefresh: () => void
  onExportPdf: () => void
}

export default function CampaignAnalyticsDashboard({
  campaign,
  analytics,
  loading,
  onRefresh,
  onExportPdf
}: CampaignAnalyticsDashboardProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-xl p-12 text-center">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Available</h3>
        <p className="text-gray-600 mb-4">Start creating posts to see analytics</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Refresh Analytics
        </button>
      </div>
    )
  }

  const { performance, platforms, insights, alerts, goals, healthScore } = analytics

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                alert.type === 'error' ? 'bg-red-50 border-red-200' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}
            >
              <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                alert.type === 'error' ? 'text-red-600' :
                alert.type === 'warning' ? 'text-yellow-600' :
                'text-blue-600'
              }`} />
              <div className="flex-1">
                <p className={`font-medium ${
                  alert.type === 'error' ? 'text-red-900' :
                  alert.type === 'warning' ? 'text-yellow-900' :
                  'text-blue-900'
                }`}>
                  {alert.message}
                </p>
                {alert.action && (
                  <p className="text-sm text-gray-600 mt-1">→ {alert.action}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              healthScore >= 80 ? 'bg-green-100 text-green-800' :
              healthScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              <Zap className="w-4 h-4" />
              <span className="font-semibold">Health: {healthScore}/100</span>
            </div>
            <button
              onClick={onExportPdf}
              className="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Total Posts"
            value={performance.totalPosts}
            icon={FileText}
            color="blue"
          />
          <MetricCard
            label="Total Reach"
            value={performance.totalReach.toLocaleString()}
            icon={Eye}
            color="purple"
          />
          <MetricCard
            label="Total Engagement"
            value={performance.totalEngagement.toLocaleString()}
            icon={Users}
            color="green"
          />
          <MetricCard
            label="Engagement Rate"
            value={`${performance.avgEngagementRate.toFixed(2)}%`}
            icon={TrendingUp}
            color="indigo"
          />
        </div>

        {/* Post Status Breakdown */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">{performance.publishedPosts}</div>
            <div className="text-sm text-green-700">Published</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">{performance.scheduledPosts}</div>
            <div className="text-sm text-blue-700">Scheduled</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{performance.draftPosts}</div>
            <div className="text-sm text-gray-700">Drafts</div>
          </div>
        </div>
      </div>

      {/* Goals Progress */}
      {goals.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Goals Progress
          </h3>
          <div className="space-y-4">
            {goals.map((goal, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{goal.goal}</p>
                    <p className="text-sm text-gray-600">
                      {goal.actual} {goal.target ? `/ ${goal.target}` : ''} ({goal.percentage}%)
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    goal.status === 'achieved' ? 'bg-green-100 text-green-800' :
                    goal.status === 'on-track' ? 'bg-blue-100 text-blue-800' :
                    goal.status === 'at-risk' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {goal.status}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      goal.status === 'achieved' ? 'bg-green-500' :
                      goal.status === 'on-track' ? 'bg-blue-500' :
                      goal.status === 'at-risk' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, goal.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform Performance */}
      {platforms.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.map((platform, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900 capitalize">{platform.platform}</span>
                  <span className={`flex items-center gap-1 text-sm ${
                    platform.trend === 'up' ? 'text-green-600' :
                    platform.trend === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {platform.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                    {platform.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                    {platform.trend === 'stable' && <Minus className="w-4 h-4" />}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{platform.postsCount}</div>
                    <div className="text-xs text-gray-600">Posts</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{platform.avgEngagement.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Avg Eng.</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{platform.totalReach.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Reach</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            AI Insights & Recommendations
          </h3>
          <div className="space-y-3">
            {insights.map((insight, idx) => {
              const Icon = insight.type === 'success' ? CheckCircle :
                          insight.type === 'warning' ? AlertTriangle :
                          insight.type === 'tip' ? Zap : Info

              return (
                <div
                  key={idx}
                  className={`flex gap-4 p-4 rounded-lg border ${
                    insight.type === 'success' ? 'bg-green-50 border-green-200' :
                    insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    insight.type === 'tip' ? 'bg-purple-50 border-purple-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    insight.type === 'success' ? 'text-green-600' :
                    insight.type === 'warning' ? 'text-yellow-600' :
                    insight.type === 'tip' ? 'text-purple-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                    {insight.action && (
                      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                        → {insight.action}
                      </button>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold h-fit ${
                    insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                    insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {insight.priority}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({ label, value, icon: Icon, color }: {
  label: string
  value: string | number
  icon: any
  color: string
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}
