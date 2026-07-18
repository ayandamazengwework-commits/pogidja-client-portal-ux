import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Get logged in profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Staff can access everything
  if (['staff', 'manager', 'admin'].includes(profile.role)) {
    return downloadDocument(supabase, id)
  }

  // Get logged in client
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  if (!client) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Get requested document
  const { data: document } = await supabase
    .from('service_documents')
    .select('*')
    .eq('id', id)
    .single()

  if (!document) {
    return new NextResponse('Document not found', { status: 404 })
  }

  // Verify document belongs to this client's service
  const { data: service } = await supabase
    .from('services')
    .select('client_id')
    .eq('id', document.service_id)
    .single()

  if (!service || service.client_id !== client.id) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  return downloadDocument(supabase, id)
}

async function downloadDocument(
  supabase: Awaited<ReturnType<typeof createClient>>,
  id: string
) {
  const { data: document } = await supabase
    .from('service_documents')
    .select('*')
    .eq('id', id)
    .single()

  if (!document) {
    return new NextResponse('Document not found', { status: 404 })
  }

  // Force the correct bucket name
  const { data, error } = await supabase.storage
    .from('service-documents')
    .createSignedUrl(document.storage_path, 60)

  if (error || !data?.signedUrl) {
    return new NextResponse('Unable to generate download link.', { status: 500 })
  }

  return NextResponse.redirect(data.signedUrl)
}
