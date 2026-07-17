import { Search, Mail } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default async function StaffMessagesPage() {
  const supabase = await createClient()

  const { data: messages } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(
        first_name,
        last_name,
        company_name
      ),
      recipient:profiles!messages_recipient_id_fkey(
        first_name,
        last_name,
        company_name
      )
    `)
    .order('created_at', {
      ascending: false,
    })

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Messages
        </h1>

        <p className="mt-2 text-muted-foreground">
          Client communication history.
        </p>

      </div>

      <div className="relative max-w-md">

        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <Input
          placeholder="Search messages..."
          className="pl-11"
        />

      </div>

      {messages?.length ? (

        <div className="space-y-5">

          {messages.map((message) => (

            <Card
              key={message.id}
              className="rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg"
            >

              <CardContent className="space-y-5 p-6">

                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">

                  <div>

                    <h2 className="text-lg font-semibold">
                      {message.subject || 'No Subject'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">

                      From:{' '}

                      <strong>

                        {message.sender?.company_name ||

                          `${message.sender?.first_name ?? ''} ${message.sender?.last_name ?? ''}`}

                      </strong>

                    </p>

                    <p className="text-sm text-slate-500">

                      To:{' '}

                      <strong>

                        {message.recipient?.company_name ||

                          `${message.recipient?.first_name ?? ''} ${message.recipient?.last_name ?? ''}`}

                      </strong>

                    </p>

                  </div>

                  <div className="text-sm text-slate-400">

                    {new Date(
                      message.created_at
                    ).toLocaleString()}

                  </div>

                </div>

                <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">

                  {message.body.length > 250
                    ? `${message.body.substring(0, 250)}...`
                    : message.body}

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      ) : (

        <Card className="rounded-3xl">

          <CardContent className="py-20 text-center">

            <Mail className="mx-auto mb-5 h-12 w-12 text-slate-300" />

            <h2 className="text-2xl font-bold">
              No Messages
            </h2>

            <p className="mt-3 text-slate-500">
              Client conversations will appear here.
            </p>

          </CardContent>

        </Card>

      )}

    </div>
  )
}
