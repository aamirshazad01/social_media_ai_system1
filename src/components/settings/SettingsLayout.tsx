'use client'

import React, { useState } from 'react'
import { Users, Settings, Activity, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

type Tab = 'members' | 'workspace' | 'activity'

interface SettingsLayoutProps {
  children: React.ReactNode
  activeTab: Tab
}

const TABS: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
  {
    id: 'members',
    label: 'Members',
    icon: <Users size={20} />,
  },
  {
    id: 'workspace',
    label: 'Settings',
    icon: <Settings size={20} />,
  },
  {
    id: 'activity',
    label: 'Activity Log',
    icon: <Activity size={20} />,
  },
]

export default function SettingsLayout({ children, activeTab }: SettingsLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="text-slate hover:text-charcoal transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold text-charcoal">Workspace Settings</h1>
          </div>
          <p className="text-slate">Manage your workspace, members, and activity</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2 sticky top-8">
              {TABS.map(tab => (
                <Link
                  key={tab.id}
                  href={`/settings?tab=${tab.id}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
