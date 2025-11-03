'use client'

import React, { useState, useEffect, useContext } from 'react'
import { AlertCircle, Loader2, Save, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { AuthContext } from '@/contexts/AuthContext'
import type { Platform } from '@/types'

interface ApiCredential {
  platform: Platform
  appId?: string
  appSecret?: string
  clientId?: string
  clientSecret?: string
  refreshToken?: string
}

interface ApiHealth {
  platform: Platform
  status: 'healthy' | 'warning' | 'error'
  message: string
  lastChecked?: string
}

const ApiSettingsTab: React.FC = () => {
  const { userRole } = useContext(AuthContext)
  const [credentials, setCredentials] = useState<Record<Platform, any>>({
    twitter: {},
    linkedin: {},
    facebook: {},
    instagram: {},
  })
  const [health, setHealth] = useState<Record<Platform, ApiHealth>>({
    twitter: { platform: 'twitter', status: 'healthy', message: 'Checking...' },
    linkedin: { platform: 'linkedin', status: 'healthy', message: 'Checking...' },
    facebook: { platform: 'facebook', status: 'healthy', message: 'Checking...' },
    instagram: { platform: 'instagram', status: 'healthy', message: 'Checking...' },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSecrets, setShowSecrets] = useState<Set<string>>(new Set())
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Check role - only admins can manage API settings
  if (userRole !== 'admin') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-800">
          <p className="font-semibold">Access Denied</p>
          <p>Only workspace admins can manage API settings.</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    loadApiSettings()
    loadApiHealth()
  }, [])

  const loadApiSettings = async () => {
    try {
      const response = await fetch('/api/settings/api-credentials')
      if (response.ok) {
        const data = await response.json()
        setCredentials(data)
      }
    } catch (error) {
      console.error('Failed to load API settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadApiHealth = async () => {
    try {
      const response = await fetch('/api/settings/api-health')
      if (response.ok) {
        const data = await response.json()
        setHealth(data)
      }
    } catch (error) {
      console.error('Failed to load API health:', error)
    }
  }

  const handleCredentialChange = (platform: Platform, field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }))
    setSuccessMessage('')
    setErrorMessage('')
  }

  const handleSave = async () => {
    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/settings/api-credentials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error('Failed to save credentials')
      }

      setSuccessMessage('API credentials saved successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save credentials')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleShowSecret = (key: string) => {
    setShowSecrets(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const formatFieldName = (field: string): string => {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  const isSecretField = (field: string): boolean => {
    return field.toLowerCase().includes('secret') || field.toLowerCase().includes('token')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-charcoal-dark">API Settings</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">OAuth App Configuration</p>
          <p>
            Configure your OAuth applications for each platform. These credentials are required
            for users to connect their accounts. All values are encrypted at rest.
          </p>
        </div>
      </div>

      {/* API Health Status */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-charcoal-dark mb-4">API Health Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.entries(health) as [Platform, ApiHealth][]).map(([platform, healthStatus]) => (
            <div
              key={platform}
              className={`border rounded-lg p-4 ${
                healthStatus.status === 'healthy'
                  ? 'bg-green-50 border-green-200'
                  : healthStatus.status === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {healthStatus.status === 'healthy' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : healthStatus.status === 'warning' ? (
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-sm capitalize">{platform}</p>
                  <p
                    className={`text-sm ${
                      healthStatus.status === 'healthy'
                        ? 'text-green-800'
                        : healthStatus.status === 'warning'
                          ? 'text-yellow-800'
                          : 'text-red-800'
                    }`}
                  >
                    {healthStatus.message}
                  </p>
                  {healthStatus.lastChecked && (
                    <p className="text-xs text-slate mt-1">
                      Last checked: {new Date(healthStatus.lastChecked).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* API Credentials */}
      <div>
        <h3 className="text-lg font-semibold text-charcoal-dark mb-4">OAuth Credentials</h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-slate mr-2" />
            <span className="text-slate">Loading API settings...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {(Object.entries(credentials) as [Platform, any][]).map(([platform, platformCreds]) => (
              <div key={platform} className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-charcoal-dark mb-4 capitalize">
                  {platform}
                </h4>

                <div className="space-y-4">
                  {Object.entries(platformCreds).map(([field, value]) => {
                    const fieldKey = `${platform}_${field}`
                    const isSecret = isSecretField(field)
                    const showValue = showSecrets.has(fieldKey)

                    return (
                      <div key={field}>
                        <label className="block text-sm font-medium text-charcoal-dark mb-2">
                          {formatFieldName(field)}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type={isSecret && !showValue ? 'password' : 'text'}
                            value={value || ''}
                            onChange={e => handleCredentialChange(platform, field, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder={`Enter ${formatFieldName(field)}`}
                          />
                          {isSecret && (
                            <button
                              onClick={() => toggleShowSecret(fieldKey)}
                              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              title={showValue ? 'Hide' : 'Show'}
                            >
                              {showValue ? (
                                <EyeOff className="w-5 h-5 text-slate" />
                              ) : (
                                <Eye className="w-5 h-5 text-slate" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-slate">
          <strong>Security Notice:</strong> All credentials are encrypted using AES-256 encryption
          before being stored. Never share your API secrets. Only workspace admins can access
          and modify these settings.
        </p>
      </div>
    </div>
  )
}

export default ApiSettingsTab
