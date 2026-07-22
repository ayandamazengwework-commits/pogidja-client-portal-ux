import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

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

  // ---------------------------------------------------
  // Logged in profile
  // ---------------------------------------------------

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

  // ---------------------------------------------------
  // Staff/Admin
  // ---------------------------------------------------

  if (
    profile.role === 'staff' ||
    profile.role === 'manager' ||
    profile.role === 'admin'
  ) {
    return downloadDocument(id)
  }

  // ---------------------------------------------------
  // Client
  // ---------------------------------------------------

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

  return downloadDocument(id)
}

// ======================================================
// DOWNLOAD
// ======================================================

async function downloadDocument(id: string) {
  const { data: document, error } = await supabaseAdmin
    .from('service_documents')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !document) {
    return new NextResponse('Document not found', {
      status: 404,
    })
  }

  console.log('================ DOCUMENT DOWNLOAD ================')
  console.log('Bucket:', document.bucket_name)
  console.log('Path:', document.storage_path)

  const { data: file, error: downloadError } =
    await supabaseAdmin.storage
      .from(document.bucket_name)
      .download(document.storage_path)

  console.log('Download Error:', downloadError)
  console.log('===================================================')

  if (downloadError || !file) {
    return NextResponse.json(
      {
        bucket: document.bucket_name,
        path: document.storage_path,
        error: downloadError,
      },
      {
        status: 500,
      }
    )
  }

  return new NextResponse(file, {
    headers: {
      'Content-Type':
        document.mime_type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${document.file_name}"`,
      'Cache-Control': 'private, max-age=0',
    },
  })
}
