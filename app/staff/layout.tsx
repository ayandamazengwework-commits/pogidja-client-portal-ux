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

  const {
    data: { user },
  } = await supabase.auth.getUser()
console.log('Logged in user ID:', user?.id)
console.log('Logged in email:', user?.email)
  
  // Protect all staff pages
  if (!user) {
    redirect('/auth/staff-login')
  }

const { data: profile, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .maybeSingle()

console.log('Staff profile:', profile)
console.log('Profile error:', error)
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
