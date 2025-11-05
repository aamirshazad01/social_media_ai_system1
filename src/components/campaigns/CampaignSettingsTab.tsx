/**
 * Campaign Settings Tab
 * Edit campaign configuration and metadata
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Campaign } from '@/types'
import { Save, AlertCircle } from 'lucide-react'

interface CampaignSettingsTabProps {
  campaign: Campaign
  onUpdate: (id: string, updates: Partial<Campaign>) => Promise<void>
}

export default function CampaignSettingsTab({
  campaign,
  onUpdate
}: CampaignSettingsTabProps) {
  const [formData, setFormData] = useState({
    name: campaign.name || '',
    description: campaign.description || '',
    startDate: campaign.startDate?.split('T')[0] || '',
    endDate: campaign.endDate?.split('T')[0] || '',
    goals: (campaign.goals || []).join('\n'),
    status: campaign.status || 'planning',
    campaignType: campaign.campaignType || '',
    contentThemes: (campaign.contentThemes || []).join(', '),
    budgetHours: campaign.budgetHours || '',
    tags: (campaign.tags || []).join(', ')
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const campaignTypes = [
    { value: '', label: 'Select type' },
    { value: 'awareness', label: 'Brand Awareness' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'conversion', label: 'Conversion' },
    { value: 'retention', label: 'Customer Retention' }
  ]

  const statusOptions = [
    { value: 'planning', label: 'Planning' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'completed', label: 'Completed' }
  ]

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required'
    }

    if (formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    setSaving(true)
    setSaved(false)

    try {
      const goals = formData.goals
        .split('\n')
        .map(g => g.trim())
        .filter(g => g.length > 0)

      const themes = formData.contentThemes
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const tags = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const updates: Partial<Campaign> = {
        name: formData.name,
        description: formData.description || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        goals: goals.length > 0 ? goals : undefined,
        status: formData.status as Campaign['status'],
        campaignType: formData.campaignType as Campaign['campaignType'] || undefined,
        contentThemes: themes.length > 0 ? themes : undefined,
        budgetHours: formData.budgetHours ? Number(formData.budgetHours) : undefined,
        tags: tags.length > 0 ? tags : undefined
      }

      await onUpdate(campaign.id, updates)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving campaign:', error)
      setErrors({ submit: 'Failed to save changes. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Campaign Settings</h3>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Campaign Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
              />
              {errors.name && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
              placeholder="Describe your campaign objectives and strategy..."
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
              />
              {errors.endDate && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.endDate}
                </div>
              )}
            </div>
          </div>

          {/* Campaign Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Campaign Type
              </label>
              <select
                value={formData.campaignType}
                onChange={(e) => setFormData({ ...formData, campaignType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
              >
                {campaignTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Budget (Hours)
              </label>
              <input
                type="number"
                min="0"
                value={formData.budgetHours}
                onChange={(e) => setFormData({ ...formData, budgetHours: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., 40"
              />
            </div>
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Campaign Goals
            </label>
            <textarea
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              rows={5}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none font-mono text-sm"
              placeholder="Increase brand awareness by 50%&#10;Generate 1,000 qualified leads&#10;Achieve 5% engagement rate"
            />
            <p className="text-xs text-gray-500 mt-1">Enter one goal per line</p>
          </div>

          {/* Content Themes */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Content Themes
            </label>
            <input
              type="text"
              value={formData.contentThemes}
              onChange={(e) => setFormData({ ...formData, contentThemes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="e.g., Product Features, Customer Stories, Industry Insights"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated list of themes</p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="e.g., Q1-2025, Product-Launch, Social-Media"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated tags for organization</p>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <p className="font-medium">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Save Success */}
          {saved && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">✓ Changes saved successfully</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                // Reset to original values
                setFormData({
                  name: campaign.name || '',
                  description: campaign.description || '',
                  startDate: campaign.startDate?.split('T')[0] || '',
                  endDate: campaign.endDate?.split('T')[0] || '',
                  goals: (campaign.goals || []).join('\n'),
                  status: campaign.status || 'planning',
                  campaignType: campaign.campaignType || '',
                  contentThemes: (campaign.contentThemes || []).join(', '),
                  budgetHours: campaign.budgetHours || '',
                  tags: (campaign.tags || []).join(', ')
                })
                setErrors({})
              }}
              className="px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium text-gray-700 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
