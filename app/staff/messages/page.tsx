import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'

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
          Client communication.
        </p>
      </div>

      <div className="space-y-4">
        {messages?.length ? (
          messages.map((message) => (
            <Card key={message.id}>
              <CardContent className="space-y-3 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">
                    {message.subject || 'No Subject'}
                  </h2>

                  <span className="text-xs text-slate-400">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="text-sm text-slate-500">
                  <strong>From:</strong>{' '}
                  {message.sender?.company_name ||
                    `${message.sender?.first_name ?? ''} ${message.sender?.last_name ?? ''}`}
                </p>

                <p className="text-sm text-slate-500">
                  <strong>To:</strong>{' '}
                  {message.recipient?.company_name ||
                    `${message.recipient?.first_name ?? ''} ${message.recipient?.last_name ?? ''}`}
                </p>

                <div className="rounded-xl bg-slate-50 p-4">
                  {message.body}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-16 text-center text-slate-500">
              No messages yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
