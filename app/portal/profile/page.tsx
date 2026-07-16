import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('profile_id', user.id)
    .single()

  async function logout() {
    'use server'

    const supabase = await createClient()

    await supabase.auth.signOut()

    redirect('/auth/login')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            My Profile
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your account information.
          </p>

        </div>

        <form action={logout}>
          <Button variant="destructive">
            Sign Out
          </Button>
        </form>

      </div>

      <Card className="rounded-3xl">

        <CardContent className="grid gap-8 p-8 md:grid-cols-2">

          <div>
            <p className="text-sm text-muted-foreground">
              First Name
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {profile?.first_name || '-'}
            </h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Last Name
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {profile?.last_name || '-'}
            </h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Email
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {user.email}
            </h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Phone
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {profile?.phone || '-'}
            </h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Company
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {profile?.company_name || '-'}
            </h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Client Code
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {client?.client_code || '-'}
            </h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Account Status
            </p>

            <h3 className="mt-2 text-xl font-semibold text-green-600">
              {client?.status || profile?.client_status || 'Active'}
            </h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Role
            </p>

            <h3 className="mt-2 text-xl font-semibold capitalize">
              {profile?.role}
            </h3>
          </div>

        </CardContent>

      </Card>

    </div>
  )
}
