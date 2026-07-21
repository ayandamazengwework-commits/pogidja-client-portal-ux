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

  // Get logged in profile
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

  // Staff can access everything
  if (
    profile.role === 'staff' ||
    profile.role === 'manager' ||
    profile.role === 'admin'
  ) {
    return downloadDocument(supabase, id)
  }

  // Get logged in client
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

  // Get requested document
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

  // Verify document belongs to this client's service
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
    return new NextResponse('Document not found', {
      status: 404,
    })
  }

const { data, error } = await supabase.storage
  .from(document.bucket_name)
  .createSignedUrl(document.storage_path, 60)

console.log('================ DOCUMENT DOWNLOAD ================')
console.log('Bucket:', document.bucket_name)
console.log('Storage Path:', document.storage_path)
console.log('Error:', error)
console.log('Signed URL:', data)
console.log('===================================================')

if (error) {
  return NextResponse.json(
    {
      bucket: document.bucket_name,
      path: document.storage_path,
      error,
    },
    { status: 500 }
  )
}

return NextResponse.redirect(data.signedUrl)
  }

  return NextResponse.redirect(data.signedUrl)
}
