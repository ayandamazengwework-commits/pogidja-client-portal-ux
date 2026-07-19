'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export async function sendClientInvitation(clientId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Client
  const { data: client, error } = await supabase
    .from('clients')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('id', clientId)
    .single()

  if (error || !client) {
    throw new Error('Client not found')
  }

  const profile = client.profile

  const token = crypto.randomUUID()

  // Store invitation
  const { error: inviteError } = await supabase
    .from('client_invitations')
    .insert({
      client_id: client.id,
      email: profile.email,
      token,
      expires_at: new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 7
      ),
    })

  if (inviteError) {
    throw new Error(inviteError.message)
  }

  const invitationUrl =
    `${process.env.NEXT_PUBLIC_SITE_URL}/activate-account?token=${token}`

  // Send email through your existing Resend notification system
  await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/notifications/send-client-invite`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: profile.email,
        firstName: profile.first_name,
        invitationUrl,
      }),
    }
  )

  // Activity Log
  await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,
      client_id: client.id,
      role: 'staff',
      action: 'Portal Invitation Sent',
      description: `Portal invitation emailed to ${profile.email}`,
      entity_type: 'client',
      entity_id: client.id,
    })

  revalidatePath(`/staff/clients/${client.id}`)
}
