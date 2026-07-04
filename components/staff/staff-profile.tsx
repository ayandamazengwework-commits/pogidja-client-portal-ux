import { createClient } from '@/lib/supabase/server'

export async function StaffProfile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  const initials = `${profile.first_name?.[0] ?? ''}${
    profile.last_name?.[0] ?? ''
  }`.toUpperCase()

  return (
    <div className="rounded-2xl bg-slate-50 p-4">

      <div className="mb-4 flex items-center gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E88E5] font-bold text-white">
          {initials || 'S'}
        </div>

        <div>

          <p className="font-semibold">
            {profile.first_name} {profile.last_name}
          </p>

          <p className="text-sm text-slate-500">
            {profile.role}
          </p>

        </div>

      </div>

    </div>
  )
}
