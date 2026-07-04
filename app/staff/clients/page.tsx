import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'client')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Clients
        </h1>
      </div>

      {/* Search (we'll wire this up later) */}
      <div className="max-w-md">
        <Input placeholder="Search clients..." />
      </div>

      {clients && clients.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/staff/clients/${client.id}`}
            >
              <Card className="transition hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-5">
                  <h2 className="text-lg font-semibold">
                    {client.first_name || 'Unnamed'} {client.last_name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {client.email}
                  </p>

                  {client.company_name && (
                    <p className="mt-2 text-sm text-slate-600">
                      {client.company_name}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        client.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {client.active ? 'Active' : 'Inactive'}
                    </span>

                    <span className="text-xs text-slate-400">
                      View Profile →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex h-48 items-center justify-center">
            <p className="text-slate-500">
              No clients found.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
