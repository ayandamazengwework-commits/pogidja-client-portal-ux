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

const { data, error } = await supabase.storage
  .from(document.bucket_name)
  .createSignedUrl(document.storage_path, 60 * 10)

console.log('================ DOCUMENT DOWNLOAD ================')
console.log('Bucket:', document.bucket_name)
console.log('Storage Path:', document.storage_path)
console.log('Signed URL:', data?.signedUrl)
console.log('Error:', error)
console.log('===================================================')

if (error) {
  return NextResponse.json(
    {
      bucket: document.bucket_name,
      path: document.storage_path,
      error,
    },
    {
      status: 500,
    }
  )
}

if (!data?.signedUrl) {
  return NextResponse.json(
    {
      message: 'No signed URL returned.',
      bucket: document.bucket_name,
      path: document.storage_path,
    },
    {
      status: 500,
    }
  )
}

return NextResponse.redirect(data.signedUrl)
