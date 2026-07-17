import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import { StaffSidebar } from '@/components/staff/sidebar'
import { StaffTopbar } from '@/components/staff/topbar'

const STAFF_ROLES = ['staff', 'manager', 'admin']

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

  if (!user) {
    redirect('/auth/staff-login')
  }

  // Get logged-in profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Failed to load staff profile:', error)
    redirect('/auth/staff-login')
  }

  if (!profile) {
    redirect('/auth/staff-login')
  }

  // Only staff accounts may access this area
  if (!STAFF_ROLES.includes(profile.role)) {
    redirect('/portal')
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <StaffSidebar profile={profile} />

      <div className="flex min-w-0 flex-1 flex-col">
        <StaffTopbar profile={profile} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
