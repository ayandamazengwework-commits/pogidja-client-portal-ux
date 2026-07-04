import type { ReactNode } from 'react'

import { StaffSidebar } from '@/components/staff/sidebar'
import { StaffTopbar } from '@/components/staff/topbar'
import { LogoutButton } from '@/components/staff/logout-button' 

export default function StaffLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-100">

      <StaffSidebar />

      <div className="flex flex-1 flex-col">

        <StaffTopbar />

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>

      </div>

    </div>
  )
}
