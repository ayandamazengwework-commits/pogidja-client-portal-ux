import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(
      new URL('/auth/login', request.url)
    )
  }

  // ----------------------------------------------------
  // PROFILE
  // ----------------------------------------------------

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return new NextResponse('Unauthorized', {
      status: 401,
    })
  }

  // ----------------------------------------------------
  // DOCUMENT
  // ----------------------------------------------------

  const { data: document } = await supabase
    .from('service_documents')
    .select('*')
    .eq('id', id)
    .single()

  if (!document) {
    return new NextResponse('Document not found', {
      status: 404,
    })
  }

  // ----------------------------------------------------
  // STAFF ACCESS
  // ----------------------------------------------------

  if (
    profile.role === 'staff' ||
    profile.role === 'manager' ||
    profile.role === 'admin'
  ) {
    return generateDownload(supabase, document)
  }

  // ----------------------------------------------------
  // CLIENT ACCESS
  // ----------------------------------------------------

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  if (!client) {
    return new NextResponse('Unauthorized', {
      status: 401,
    })
  }

  const { data: service } = await supabase
    .from('services')
    .select('client_id')
    .eq('id', document.service_id)
    .single()

  if (!service || service.client_id !== client.id) {
    return new NextResponse('Forbidden', {
      status: 403,
    })
  }

  return generateDownload(supabase, document)
}

async function generateDownload(
  supabase: Awaited<ReturnType<typeof createClient>>,
  document: {
    bucket_name: string
    storage_path: string
    file_name: string
  }
) {
  const { data, error } = await supabase.storage
    .from(document.bucket_name)
    .createSignedUrl(document.storage_path, 60)

  if (error || !data?.signedUrl) {
    return new NextResponse(
      'Unable to generate download link.',
      {
        status: 500,
      }
    )
  }

  return NextResponse.redirect(data.signedUrl)
}
