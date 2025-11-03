'use client'

import React, { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import SettingsLayout from '@/components/settings/SettingsLayout'
import MembersTab from '@/components/settings/MembersTab'
import WorkspaceSettingsTab from '@/components/settings/WorkspaceSettingsTab'
import ActivityLogTab from '@/components/settings/ActivityLogTab'
import ProtectedApp from '@/components/auth/ProtectedApp'

type Tab = 'members' | 'workspace' | 'activity'

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const tab = (searchParams.get('tab') || 'members') as Tab

  const content = useMemo(() => {
    switch (tab) {
      case 'members':
        return <MembersTab />
      case 'workspace':
        return <WorkspaceSettingsTab />
      case 'activity':
        return <ActivityLogTab />
      default:
        return <MembersTab />
    }
  }, [tab])

  return (
    <ProtectedApp>
      <SettingsLayout activeTab={tab}>
        {content}
      </SettingsLayout>
    </ProtectedApp>
  )
}
