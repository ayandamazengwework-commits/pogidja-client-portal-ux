import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data: clients, error } = await supabase
    .from('profiles')
    .select('*')

  console.log('Clients:', clients)
  console.log('Error:', error)

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">
        Clients
      </h1>

      {/* DEBUG - REMOVE LATER */}
      <pre className="overflow-auto rounded-lg bg-slate-100 p-4 text-xs">
        {JSON.stringify({ clients, error }, null, 2)}
      </pre>

      <div className="max-w-md">
        <Input placeholder="Search clients..." />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients?.map((client) => (
          <Link
            key={client.id}
            href={`/staff/clients/${client.id}`}
          >
            <Card className="transition hover:shadow-lg">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold">
                  {client.first_name} {client.last_name}
                </h2>

                <p className="text-sm text-slate-500">
                  {client.email}
                </p>

                <p className="text-sm text-slate-400">
                  Role: {client.role}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Click to view profile
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
