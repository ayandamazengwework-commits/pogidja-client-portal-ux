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

    <div className="flex items-start justify-between">

      <div className="flex items-center gap-5">

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1E88E5] text-2xl font-bold text-white">
          {client.first_name.charAt(0)}
          {client.last_name.charAt(0)}
        </div>

        <div>

          <h1 className="text-3xl font-bold">
            {client.first_name} {client.last_name}
          </h1>

          {client.company_name && (
            <p className="mt-1 text-lg text-slate-600">
              {client.company_name}
            </p>
          )}

          <div className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            {client.client_status ?? 'Active'}
          </div>

        </div>

      </div>

    </div>

    <div className="mt-8 grid gap-6 md:grid-cols-2">

      <div>

        <p className="text-sm font-medium text-slate-500">
          Email
        </p>

        <p className="mt-1">
          {client.email}
        </p>

      </div>

      <div>

        <p className="text-sm font-medium text-slate-500">
          Phone
        </p>

        <p className="mt-1">
          {client.phone || '-'}
        </p>

      </div>

      <div>

        <p className="text-sm font-medium text-slate-500">
          Address
        </p>

        <p className="mt-1">
          {[
            client.address,
            client.city,
            client.province,
            client.postal_code,
          ]
            .filter(Boolean)
            .join(', ') || '-'}
        </p>

      </div>

      <div>

        <p className="text-sm font-medium text-slate-500">
          Country
        </p>

        <p className="mt-1">
          {client.country}
        </p>

      </div>

      <div>

        <p className="text-sm font-medium text-slate-500">
          Company Registration
        </p>

        <p className="mt-1">
          {client.company_registration || '-'}
        </p>

      </div>

      <div>

        <p className="text-sm font-medium text-slate-500">
          VAT Number
        </p>

        <p className="mt-1">
          {client.vat_number || '-'}
        </p>

      </div>

      <div>

        <p className="text-sm font-medium text-slate-500">
          Tax Number
        </p>

        <p className="mt-1">
          {client.tax_number || '-'}
        </p>

      </div>

      <div>

        <p className="text-sm font-medium text-slate-500">
          ID Number
        </p>

        <p className="mt-1">
          {client.id_number || '-'}
        </p>

      </div>

    </div>

  </CardContent>
</Card>

<div className="grid gap-6 md:grid-cols-3">

  <Card>
    <CardContent className="p-6">

      <p className="text-sm text-slate-500">
        Services
      </p>

      <p className="mt-2 text-4xl font-bold">
        {services?.length ?? 0}
      </p>

    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">

      <p className="text-sm text-slate-500">
        Documents
      </p>

      <p className="mt-2 text-4xl font-bold">
        {documents?.length ?? 0}
      </p>

    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">

      <p className="text-sm text-slate-500">
        Activity
      </p>

      <p className="mt-2 text-4xl font-bold">
        {activity?.length ?? 0}
      </p>

    </CardContent>
  </Card>

</div>
      
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
