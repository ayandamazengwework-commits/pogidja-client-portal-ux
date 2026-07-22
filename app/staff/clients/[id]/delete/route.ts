import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse('Unauthorized', {
      status: 401,
    })
  }

  // ----------------------------
  // Load client
  // ----------------------------

  const { data: client } = await supabase
    .from('clients')
    .select('id, profile_id')
    .eq('id', id)
    .single()

  if (!client) {
    return new NextResponse('Client not found', {
      status: 404,
    })
  }

  // ----------------------------
  // Load services
  // ----------------------------

  const { data: services } = await supabase
    .from('services')
    .select('id')
    .eq('client_id', client.id)

  const serviceIds =
    services?.map((s) => s.id) ?? []

  // ----------------------------
  // Delete documents
  // ----------------------------

  if (serviceIds.length) {
    await supabase
      .from('service_documents')
      .delete()
      .in('service_id', serviceIds)

    await supabase
      .from('messages')
      .delete()
      .in('service_id', serviceIds)

    await supabase
      .from('services')
      .delete()
      .in('id', serviceIds)
  }

  // ----------------------------
  // Delete invoices
  // ----------------------------

  await supabase
    .from('invoices')
    .delete()
    .eq('client_id', client.id)

  // ----------------------------
  // Delete notifications
  // ----------------------------

  await supabase
    .from('notifications')
    .delete()
    .eq('user_id', client.profile_id)

  // ----------------------------
  // Delete activity logs
  // ----------------------------

  await supabase
    .from('activity_logs')
    .delete()
    .eq('client_id', client.id)

  // ----------------------------
  // Delete remaining messages
  // ----------------------------

  await supabase
    .from('messages')
    .delete()
    .or(
      `sender_id.eq.${client.profile_id},recipient_id.eq.${client.profile_id}`
    )

  // ----------------------------
  // Delete client
  // ----------------------------

  await supabase
    .from('clients')
    .delete()
    .eq('id', client.id)

  // ----------------------------
  // Delete profile
  // ----------------------------

  await supabase
    .from('profiles')
    .delete()
    .eq('id', client.profile_id)

  return NextResponse.json({
    success: true,
  })
}
