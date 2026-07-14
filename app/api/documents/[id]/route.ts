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

  const { data: document, error } = await supabase
    .from('service_documents')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !document) {
    return new NextResponse('Document not found.', {
      status: 404,
    })
  }

  const { data } = await supabase.storage
    .from(document.bucket_name)
    .createSignedUrl(
      document.storage_path,
      60
    )

  if (!data?.signedUrl) {
    return new NextResponse(
      'Unable to generate download link.',
      {
        status: 500,
      }
    )
  }

  return NextResponse.redirect(data.signedUrl)
}
