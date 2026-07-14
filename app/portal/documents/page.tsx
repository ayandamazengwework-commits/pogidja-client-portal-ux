import Link from 'next/link'
import {
  Download,
  FileText,
  Search,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default async function DocumentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Logged in client
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  if (!client) return null

  // Client services
  const { data: services } = await supabase
    .from('services')
    .select('id,title')
    .eq('client_id', client.id)

  const serviceIds =
    services?.map((s) => s.id) ?? []

  let documents: any[] = []

  if (serviceIds.length > 0) {
    const { data } = await supabase
      .from('service_documents')
      .select('*')
      .in('service_id', serviceIds)
      .order('created_at', {
        ascending: false,
      })

    documents = data ?? []
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Documents
        </h1>

        <p className="mt-2 text-muted-foreground">
          View every document uploaded for your requests.
        </p>

      </div>

      <div className="relative">

        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <Input
          placeholder="Search documents..."
          className="pl-11"
        />

      </div>

      {documents.length > 0 ? (

        <div className="grid gap-5">

          {documents.map((document) => {

            const service =
              services?.find(
                (s) => s.id === document.service_id
              )

            return (

              <Card
                key={document.id}
                className="rounded-2xl"
              >

                <CardContent className="flex items-center justify-between p-6">

                  <div className="flex items-center gap-4">

                    <FileText className="h-10 w-10 text-[#1E88E5]" />

                    <div>

                      <h3 className="font-semibold">
                        {document.file_name}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {service?.title}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">

                        Uploaded by{' '}
                        {document.uploaded_by_role === 'client'
                          ? 'You'
                          : 'POG Advisory'}

                        {' • '}

                        {new Date(
                          document.created_at
                        ).toLocaleDateString()}

                      </p>

                    </div>

                  </div>

                  <Button
                    asChild
                    variant="outline"
                  >

                    <Link
                      href={`/api/documents/${document.id}`}
                      target="_blank"
                    >

                      <Download className="mr-2 h-4 w-4" />

                      Download

                    </Link>

                  </Button>

                </CardContent>

              </Card>

            )

          })}

        </div>

      ) : (

        <Card>

          <CardContent className="py-20 text-center">

            <FileText className="mx-auto mb-5 h-12 w-12 text-slate-300" />

            <h2 className="text-2xl font-bold">
              No Documents Yet
            </h2>

            <p className="mt-3 text-slate-500">
              Documents uploaded by you or POG Advisory
              will appear here.
            </p>

          </CardContent>

        </Card>

      )}

    </div>
  )
}
