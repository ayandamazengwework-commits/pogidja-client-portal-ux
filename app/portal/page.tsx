import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

import Link from 'next/link'
import {
  Clock3,
  FileText,
  MessageSquare,
  Receipt,
  Upload,
} from 'lucide-react'

export default async function PortalPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

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

  if (!client) {
    redirect('/auth/login')
  }

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', {
      ascending: false,
    })

  return (
    <div className="space-y-8">

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-8 text-white">

        <p className="text-sm uppercase tracking-[0.35em] text-blue-200">
          CLIENT PORTAL
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Welcome {profile?.first_name}
        </h1>

        <p className="mt-3 max-w-2xl text-slate-300">
          Your accountant manages your application.
          You can view progress, upload requested
          documents and communicate through the portal.
        </p>

      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <Card>
          <CardContent className="p-6">

            <Clock3 className="mb-4 h-8 w-8 text-[#1E88E5]" />

            <p className="text-sm text-slate-500">
              Active Services
            </p>

            <h2 className="text-3xl font-bold">
              {services?.length ?? 0}
            </h2>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">

            <Upload className="mb-4 h-8 w-8 text-[#1E88E5]" />

            <p className="text-sm text-slate-500">
              Upload Documents
            </p>

            <Link href="/portal/documents">

              <Button className="mt-4 w-full">

                Open

              </Button>

            </Link>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">

            <MessageSquare className="mb-4 h-8 w-8 text-[#1E88E5]" />

            <p className="text-sm text-slate-500">
              Messages
            </p>

            <Link href="/portal/messages">

              <Button className="mt-4 w-full">

                View

              </Button>

            </Link>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">

            <Receipt className="mb-4 h-8 w-8 text-[#1E88E5]" />

            <p className="text-sm text-slate-500">
              Invoices
            </p>

            <Link href="/portal/invoices">

              <Button className="mt-4 w-full">

                View

              </Button>

            </Link>

          </CardContent>
        </Card>

      </div>

      <div className="space-y-6">

        {services?.map((service) => (

          <Card
            key={service.id}
            className="rounded-3xl"
          >

            <CardContent className="space-y-5 p-8">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-2xl font-bold">
                    {service.title}
                  </h2>

                  <p className="text-slate-500">
                    {service.service_type}
                  </p>

                </div>

                <div className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-700">

                  {service.status}

                </div>

              </div>

              <Progress value={service.progress} />

              <div className="flex justify-between text-sm">

                <span>

                  {service.progress}% Complete

                </span>

                <span>

                  Due:{' '}
                  {service.due_date
                    ? new Date(
                        service.due_date
                      ).toLocaleDateString()
                    : 'Not Set'}

                </span>

              </div>

              <div className="flex gap-3">

                <Link
                  href={`/portal/cases/${service.id}`}
                >

                  <Button>

                    <FileText className="mr-2 h-4 w-4" />

                    Open

                  </Button>

                </Link>

              </div>

            </CardContent>

          </Card>

        ))}

      </div>

    </div>
  )
}
