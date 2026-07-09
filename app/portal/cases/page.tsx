import Link from 'next/link'
import {
  ArrowRight,
  Calendar,
  FolderOpen,
  Search,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/shared/status-badge'

export default async function ClientRequestsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Find logged in client
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  if (!client) {
    return null
  }

  const { data: requests } = await supabase
    .from('services')
    .select(`
      *,
      service_categories (
        name
      )
    `)
    .eq('client_id', client.id)
    .order('created_at', {
      ascending: false,
    })

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold tracking-tight">
          My Requests
        </h1>

        <p className="mt-2 text-muted-foreground">
          View every service request submitted to POG Advisory.
        </p>

      </div>

      <div className="relative">

        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <Input
          placeholder="Search requests..."
          className="pl-11"
        />

      </div>

      {requests && requests.length > 0 ? (

        <div className="grid gap-6">

          {requests.map((request) => (

            <Link
              key={request.id}
              href={`/portal/cases/${request.id}`}
            >

              <Card className="group overflow-hidden rounded-3xl border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                <div className="h-1 bg-gradient-to-r from-[#17365D] to-[#1E88E5]" />

                <CardContent className="space-y-6 p-8">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">

                        {request.service_categories?.name ??
                          request.service_type}

                      </p>

                      <h2 className="mt-2 text-2xl font-bold">

                        {request.title}

                      </h2>

                    </div>

                    <StatusBadge
                      status={request.status}
                    />

                  </div>

                  <p className="line-clamp-2 text-slate-500">

                    {request.description}

                  </p>

                  <div className="grid gap-5 border-t pt-5 md:grid-cols-2">

                    <div className="flex items-center gap-3">

                      <Calendar className="h-5 w-5 text-slate-400" />

                      <div>

                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Submitted
                        </p>

                        <p className="font-medium">
                          {new Date(
                            request.created_at
                          ).toLocaleDateString()}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center justify-end gap-2 font-semibold text-[#17365D]">

                      View Request

                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />

                    </div>

                  </div>

                </CardContent>

              </Card>

            </Link>

          ))}

        </div>

      ) : (

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="flex flex-col items-center py-24">

            <FolderOpen className="mb-6 h-14 w-14 text-slate-300" />

            <h2 className="text-3xl font-bold">

              No Requests Found

            </h2>

            <p className="mt-4 max-w-lg text-center text-slate-500">

              You haven't submitted any service requests yet.

            </p>

          </CardContent>

        </Card>

      )}

    </div>
  )
}
