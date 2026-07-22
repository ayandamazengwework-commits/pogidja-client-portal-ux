'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  Search,
  Users,
  Pencil,
  Trash2,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Client {
  id: string
  client_code: string | null
  status: string
  profile: {
    first_name: string | null
    last_name: string | null
    email: string | null
    phone: string | null
  } | null
  company: {
    name: string | null
  } | null
}

interface Props {
  clients: Client[]
}

export function ClientSearch({ clients }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [query, setQuery] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filteredClients = useMemo(() => {
    if (!query.trim()) return clients

    const q = query.toLowerCase()

    return clients.filter((client) => {
      const fullName =
        `${client.profile?.first_name ?? ''} ${client.profile?.last_name ?? ''}`.toLowerCase()

      return (
        fullName.includes(q) ||
        client.profile?.email?.toLowerCase().includes(q) ||
        client.profile?.phone?.toLowerCase().includes(q) ||
        client.company?.name?.toLowerCase().includes(q) ||
        client.client_code?.toLowerCase().includes(q)
      )
    })
  }, [clients, query])

  async function deleteClient(id: string) {
    const confirmed = window.confirm(
      'Delete this client? This cannot be undone.'
    )

    if (!confirmed) return

    setDeleting(id)

    await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by client, company, email or code..."
          className="pl-11"
        />
      </div>

      {filteredClients.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredClients.map((client) => {
            const initials =
              `${client.profile?.first_name?.[0] ?? ''}${client.profile?.last_name?.[0] ?? ''}`

            return (
              <Card
                key={client.id}
                className="rounded-3xl border-0 shadow-sm transition hover:shadow-xl"
              >
                <CardContent className="space-y-6 p-6">
                  <Link href={`/staff/clients/${client.id}`}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                        {initials || '?'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-lg font-bold">
                          {client.company?.name ||
                            `${client.profile?.first_name ?? ''} ${client.profile?.last_name ?? ''}`}
                        </h2>

                        <p className="truncate text-sm text-slate-500">
                          {client.profile?.email}
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          {client.profile?.phone || 'No phone number'}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        client.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : client.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {client.status}
                    </span>

                    <span className="text-xs text-slate-400">
                      {client.client_code || '-'}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1"
                    >
                      <Link href={`/staff/clients/${client.id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>

                    <Button
                      variant="destructive"
                      disabled={deleting === client.id}
                      onClick={() => deleteClient(client.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="rounded-3xl">
          <CardContent className="py-16 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-slate-300" />

            <h2 className="text-2xl font-bold">
              No matching clients
            </h2>

            <p className="mt-2 text-slate-500">
              Try another search.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
