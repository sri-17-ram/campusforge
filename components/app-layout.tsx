'use client'

import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        {/* Top Bar */}
        <TopBar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
