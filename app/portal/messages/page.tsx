import { MessageSquare } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'

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

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Messages
        </h1>

        <p className="mt-2 text-muted-foreground">
          Secure communication with POG Advisory.
        </p>
      </div>

      {messages && messages.length > 0 ? (

        <div className="space-y-4">

          {messages.map((message) => (

            <Card
              key={message.id}
              className="rounded-2xl"
            >
              <CardContent className="p-6">

                <h3 className="font-semibold">
                  {message.subject ?? 'No Subject'}
                </h3>

                <p className="mt-3 text-muted-foreground">
                  {message.body}
                </p>

                <p className="mt-4 text-xs text-slate-400">
                  {new Date(
                    message.created_at
                  ).toLocaleString()}
                </p>

              </CardContent>
            </Card>

          ))}

        </div>

      ) : (

        <Card>

          <CardContent className="py-20 text-center">

            <MessageSquare className="mx-auto mb-5 h-12 w-12 text-slate-300" />

            <h2 className="text-2xl font-bold">
              No Messages
            </h2>

            <p className="mt-3 text-slate-500">
              Your conversations with POG Advisory will appear here.
            </p>

          </CardContent>

        </Card>

      )}

    </div>
  )
}
