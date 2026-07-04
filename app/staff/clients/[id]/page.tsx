import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ClientProfilePage({
  params,
}: Props) {
  const { id } = await params

  const supabase = await createClient()

  // Client
  const { data: client } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!client) {
    notFound()
  }

  // Services
const { data: services } = await supabase
  .from('services')
  .select('*')
  .eq('client_id', id)

  // Documents
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('client_id', id)

  // Activity
  const { data: activity } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">

      {/* Client Header */}

      <Card>
        <CardContent className="p-8">

          <h1 className="text-3xl font-bold">
            {client.first_name} {client.last_name}
          </h1>

          <p className="mt-2 text-slate-500">
            {client.email}
          </p>

          <p className="text-slate-500">
            {client.phone}
          </p>

        </CardContent>
      </Card>

      {/* Services */}

      <Card>
        <CardContent className="p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Active Services
          </h2>

         {services && services.length > 0 ? (
  <div className="space-y-3">
    {services.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border p-4"
                >
                  {item.title}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">
              No active services.
            </p>
          )}

        </CardContent>
      </Card>

      {/* Documents */}

      <Card>
        <CardContent className="p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Documents
          </h2>

          {documents && documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border p-4"
                >
                  {doc.name}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">
              No documents uploaded.
            </p>
          )}

        </CardContent>
      </Card>

      {/* Activity */}

      <Card>
        <CardContent className="p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Recent Activity
          </h2>

          {activity && activity.length > 0 ? (
            <div className="space-y-3">
              {activity.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border p-4"
                >
                  <p className="font-medium">
                    {item.action}
                  </p>

                  {item.description && (
                    <p className="text-sm text-slate-500">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">
              No activity recorded.
            </p>
          )}

        </CardContent>
      </Card>

    </div>
  )
}
