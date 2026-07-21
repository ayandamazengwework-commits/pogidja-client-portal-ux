'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export async function uploadDocument(
  formData: FormData
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated.')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const file = formData.get('file') as File
  const serviceId = formData.get('serviceId') as string

  if (!file) {
    throw new Error('No file selected.')
  }

  const extension =
    file.name.split('.').pop() ?? ''

  const fileName = `${randomUUID()}.${extension}`

  const storagePath = `${serviceId}/${fileName}`

  const bucket = 'service-documents'

  console.log('================= START UPLOAD =================')
  console.log('User:', user.id)
  console.log('Service:', serviceId)
  console.log('Bucket:', bucket)
  console.log('Storage Path:', storagePath)
  console.log('File Name:', file.name)
  console.log('File Size:', file.size)
  console.log('Mime Type:', file.type)

  const {
    data: uploadData,
    error: uploadError,
  } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file)

  console.log('Upload Data:', uploadData)
  console.log('Upload Error:', uploadError)

  if (uploadError) {
    console.error(uploadError)
    throw new Error(uploadError.message)
  }

  const folder = storagePath.split('/')[0]

  const {
    data: files,
    error: listError,
  } = await supabase.storage
    .from(bucket)
    .list(folder)

  console.log('Folder Contents:', files)
  console.log('List Error:', listError)

  const uploaderRole =
    profile?.role === 'client'
      ? 'client'
      : 'staff'

  const { error: documentError } =
    await supabase
      .from('service_documents')
      .insert({
        service_id: serviceId,
        uploaded_by: user.id,
        uploaded_by_role: uploaderRole,
        file_name: file.name,
        storage_path: storagePath,
        bucket_name: bucket,
        mime_type: file.type,
        file_size: file.size,
        document_type: uploaderRole,
      })

  console.log('Document Insert Error:', documentError)

  if (documentError) {
    throw documentError
  }

  const { error: activityError } =
    await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,
        role: uploaderRole,
        action: 'Document Uploaded',
        description: file.name,
        entity_type: 'service',
        entity_id: serviceId,
      })

  console.log('Activity Error:', activityError)

  console.log('================= END UPLOAD =================')

  revalidatePath(`/portal/cases/${serviceId}`)
  revalidatePath(`/staff/services/${serviceId}`)
}
