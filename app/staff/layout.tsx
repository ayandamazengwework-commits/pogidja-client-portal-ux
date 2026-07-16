import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import { StaffSidebar } from '@/components/staff/sidebar'
import { StaffTopbar } from '@/components/staff/topbar'

export default async function StaffLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Not logged in
  if (!user) {
    redirect('/auth/staff-login')
  }

  // Get profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // No profile found
  if (error || !profile) {
    console.error('Profile Error:', error)
    redirect('/auth/staff-login')
  }

  // Prevent clients from entering staff portal
  if (!['staff', 'manager', 'admin'].includes(profile.role)) {
    redirect('/portal')
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <StaffSidebar profile={profile} />

      <div className="flex flex-1 flex-col">
        <StaffTopbar profile={profile} />

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
