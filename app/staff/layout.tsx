import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import { StaffSidebar } from '@/components/staff/sidebar'
import { StaffTopbar } from '@/components/staff/topbar'

const STAFF_ROLES = [
  'staff',
  'manager',
  'admin',
]

export default async function StaffLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  console.log(
    'STAFF AUTH USER:',
    user?.id,
    authError
  )

  if (!user) {
    redirect('/auth/staff-login')
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from('profiles')
    .select(
      'id, first_name, last_name, role'
    )
    .eq('id', user.id)
    .maybeSingle()

  console.log(
    'STAFF PROFILE:',
    profile
  )

  console.log(
    'STAFF PROFILE ERROR:',
    profileError
  )

  if (profileError) {
    throw new Error(profileError.message)
  }

  if (!profile) {
    redirect('/auth/staff-login')
  }

  if (!STAFF_ROLES.includes(profile.role)) {
    redirect('/portal')
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-100">

      {/* Desktop Sidebar */}
      <StaffSidebar profile={profile} />

      {/* Main Application Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Topbar */}
        <StaffTopbar profile={profile} />

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  )
}
