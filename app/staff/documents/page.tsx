import Link from 'next/link'
import {
  Download,
  FileText,
  Search,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default async function StaffDocumentsPage() {
  const supabase = await createClient()

  const { data: documents } = await supabase
    .from('service_documents')
    .select(`
      *,
      service:services(
        id,
        title,
        status
      )
    `)
    .order('created_at', {
      ascending: false,
    })

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Documents
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage every document uploaded by clients and staff.
          </p>

        </div>

        <Button>
          Upload Document
        </Button>

      </div>

      <div className="relative max-w-md">

        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <Input
          placeholder="Search documents..."
          className="pl-11"
        />

      </div>

      {documents && documents.length > 0 ? (

        <div className="grid gap-5">

          {documents.map((document) => (

            <Card
              key={document.id}
              className="rounded-2xl"
            >

              <CardContent className="flex items-center justify-between p-6">

                <div className="flex items-center gap-4">

                  <div className="rounded-2xl bg-blue-100 p-4">

                    <FileText className="h-7 w-7 text-blue-700" />

                  </div>

                  <div>

                    <h3 className="font-semibold">
                      {document.file_name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {document.service?.title}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">

                      <span>

                        Uploaded by{' '}
                        {document.uploaded_by_role === 'client'
                          ? 'Client'
                          : 'Staff'}

                      </span>

                      <span>

                        {new Date(
                          document.created_at
                        ).toLocaleDateString()}

                      </span>

                    </div>

                  </div>

                </div>

                <div className="flex gap-2">

                  <Button
                    variant="outline"
                    asChild
                  >

                    <Link
                      href={`/staff/cases/${document.service_id}`}
                    >
                      View Case
                    </Link>

                  </Button>

                  <Button
                    asChild
                    variant="default"
                  >

                    <Link
                      href={`/api/documents/${document.id}`}
                      target="_blank"
                    >

                      <Download className="mr-2 h-4 w-4" />

                      Download

                    </Link>

                  </Button>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      ) : (

        <Card>

          <CardContent className="py-20 text-center">

            <FileText className="mx-auto mb-5 h-12 w-12 text-slate-300" />

            <h2 className="text-2xl font-bold">
              No Documents
            </h2>

            <p className="mt-3 text-slate-500">
              Uploaded documents will appear here.
            </p>

          </CardContent>

        </Card>

      )}

    </div>
  )
}
