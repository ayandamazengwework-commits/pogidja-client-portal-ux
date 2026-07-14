import {
  Clock,
  Mail,
  MessageCircle,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order('created_at', {
      ascending: false,
    })

  const unread =
    messages?.filter((m) => !m.read).length ?? 0

  return (
    <div className="space-y-8">

      {/* Hero */}

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-6 text-white shadow-xl md:p-10">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
              CLIENT COMMUNICATION
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              Messages
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Secure communication between you and
              POG Advisory regarding your service
              requests.
            </p>

          </div>

          <Card className="border-0 bg-white/10 backdrop-blur">

            <CardContent className="p-6 text-center">

              <Mail className="mx-auto mb-3 h-10 w-10 text-blue-200" />

              <p className="text-sm text-slate-300">
                Unread
              </p>

              <p className="mt-2 text-4xl font-bold">
                {unread}
              </p>

            </CardContent>

          </Card>

        </div>

      </section>

      {/* Messages */}

      {messages && messages.length > 0 ? (

        <div className="space-y-5">

          {messages.map((message) => (

            <Card
              key={message.id}
              className="rounded-3xl border-0 shadow-sm transition-all hover:shadow-lg"
            >

              <CardContent className="space-y-5 p-6">

                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                  <div className="space-y-2">

                    <div className="flex items-center gap-3">

                      <MessageCircle className="h-5 w-5 text-blue-600" />

                      <h3 className="text-lg font-semibold">
                        {message.subject || "No Subject"}
                      </h3>

                    </div>

                    <Badge
                      variant={
                        message.read
                          ? "secondary"
                          : "default"
                      }
                    >
                      {message.read
                        ? "Read"
                        : "Unread"}
                    </Badge>

                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">

                    <Clock className="h-4 w-4" />

                    {new Date(
                      message.created_at
                    ).toLocaleString()}

                  </div>

                </div>

                <div className="rounded-2xl bg-slate-50 p-5 leading-7 text-slate-700">

                  {message.body}

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      ) : (

        <Card className="rounded-3xl border-0 shadow-sm">

          <CardContent className="flex flex-col items-center py-24">

            <div className="mb-8 rounded-full bg-slate-100 p-8">

              <MessageCircle className="h-14 w-14 text-slate-400" />

            </div>

            <h2 className="text-3xl font-bold">
              No Messages Yet
            </h2>

            <p className="mt-4 max-w-xl text-center text-slate-500">

              Once POG Advisory sends updates or
              requests additional information, your
              conversations will appear here.

            </p>

          </CardContent>

        </Card>

      )}

    </div>
  )
}
