import type { ReactNode } from 'react'

import { StaffSidebar } from '@/components/staff/sidebar'

export default function StaffLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <StaffSidebar />

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
