import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'

export default async function ProfilePage() {
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

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('profile_id', user.id)
    .single()

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          My Profile
        </h1>

        <p className="mt-2 text-muted-foreground">
          Your client information.
        </p>
      </div>

      <Card className="rounded-3xl">
        <CardContent className="grid gap-8 p-8 md:grid-cols-2">

          <div>
            <p className="text-sm text-muted-foreground">
              First Name
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {profile?.first_name ?? '-'}
            </h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Last Name
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {profile?.last_name ?? '-'}
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
              Company
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {profile?.company_name ?? '-'}
            </h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Client Code
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {client?.client_code}
            </h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Status
            </p>

            <h3 className="mt-2 text-xl font-semibold capitalize text-green-600">
              {client?.status}
            </h3>
          </div>

        </CardContent>
      </Card>

    </div>
  )
}
