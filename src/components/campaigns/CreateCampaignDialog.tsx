/**
 * Create Campaign Dialog
 * Professional form for creating new campaigns
 */

'use client'

import React, { useState } from 'react'
import { Campaign } from '@/types'
import { X, Sparkles, AlertCircle } from 'lucide-react'

interface CreateCampaignDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: Partial<Campaign>) => Promise<void>
}

export default function CreateCampaignDialog({
  isOpen,
  onClose,
  onCreate
}: CreateCampaignDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    goals: '',
    campaignType: '' as Campaign['campaignType'] | '',
    contentThemes: '',
    status: 'planning' as Campaign['status']
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const campaignTypes = [
    { value: 'awareness', label: 'Brand Awareness', description: 'Increase brand visibility and reach' },
    { value: 'engagement', label: 'Engagement', description: 'Drive interactions and community building' },
    { value: 'conversion', label: 'Conversion', description: 'Generate leads and sales' },
    { value: 'retention', label: 'Customer Retention', description: 'Keep customers engaged and loyal' }
  ]

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required'
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be 100 characters or less'
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less'
    }

    if (formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setSubmitting(true)
    
    try {
      const goals = formData.goals
        .split('\n')
        .map(g => g.trim())
        .filter(g => g.length > 0)

      const themes = formData.contentThemes
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const campaignData: Partial<Campaign> = {
        name: formData.name,
        description: formData.description || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        goals: goals.length > 0 ? goals : undefined,
        campaignType: formData.campaignType || undefined,
        contentThemes: themes.length > 0 ? themes : undefined,
        status: formData.status
      }

      await onCreate(campaignData)

      // Reset form
      setFormData({
        name: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        goals: '',
        campaignType: '',
        contentThemes: '',
        status: 'planning'
      })
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Error creating campaign:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create New Campaign</h2>
              <p className="text-indigo-100 text-sm">Launch a new marketing campaign</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Campaign Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Campaign Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                placeholder="e.g., Q1 Product Launch"
              />
              {errors.name && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Campaign Type */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Campaign Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {campaignTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, campaignType: type.value as any })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.campaignType === type.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-medium text-gray-900 mb-1">{type.label}</div>
                    <div className="text-sm text-gray-600">{type.description}</div>
                  </button>
                ))}
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                placeholder="Describe your campaign objectives and strategy..."
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {errors.description || 'Brief overview of your campaign'}
                </span>
                <span className="text-xs text-gray-500">
                  {formData.description.length}/500
                </span>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                  className={`w-full px-4 py-3 rounded-lg border ${
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

            {/* Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Campaign Goals
              </label>
              <textarea
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none font-mono text-sm"
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., Product Features, Customer Stories, Industry Insights"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated list of themes</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
            >
              {submitting ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
