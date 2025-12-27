'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

// Mock user for now - in production this would come from the session
const mockUser = {
  name: 'Jean Dupont',
  email: 'jean.dupont@exemple.com',
  image: null,
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const siaId = params.siaId as string | undefined

  // Mock SIA name - in production would fetch from API
  const siaName = siaId ? 'Système de tri de candidatures' : undefined

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        siaId={siaId}
        siaName={siaName}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={mockUser} />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
