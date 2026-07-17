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

      {/* Hero */}

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-6 text-white shadow-xl md:p-10">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
              DOCUMENT MANAGEMENT
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              Documents
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              View, download and manage every document
              uploaded by clients and staff.
            </p>

          </div>

          <Card className="border-0 bg-white/10 backdrop-blur">

            <CardContent className="p-6 text-center">

              <FileText className="mx-auto mb-3 h-10 w-10 text-blue-200" />

              <p className="text-sm text-slate-300">
                Total Documents
              </p>

              <p className="mt-2 text-4xl font-bold">
                {documents?.length ?? 0}
              </p>

            </CardContent>

          </Card>

        </div>

      </section>

      {/* Search */}

      <div className="relative max-w-xl">

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
              className="rounded-3xl border-0 shadow-sm transition hover:shadow-lg"
            >

              <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-start gap-4">

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

                    <p className="mt-2 text-xs text-slate-500">

                      {document.file_size
                        ? `${Math.round(document.file_size / 1024)} KB`
                        : '-'}

                      {' • '}

                      {document.mime_type || '-'}

                    </p>

                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">

                      <span>

                        Uploaded by{' '}
                        <strong>

                          {document.uploaded_by_role === 'client'
                            ? 'Client'
                            : 'Staff'}

                        </strong>

                      </span>

                      <span>

                        {new Date(
                          document.created_at
                        ).toLocaleDateString()}

                      </span>

                    </div>

                  </div>

                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">

                  <Button
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto"
                  >

                    <Link
                      href={`/staff/services/${document.service_id}`}
                    >
                      View Service
                    </Link>

                  </Button>

                  <Button
                    asChild
                    className="w-full sm:w-auto"
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

        <Card className="rounded-3xl">

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
