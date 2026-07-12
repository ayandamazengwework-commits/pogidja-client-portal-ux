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

  const file = formData.get('file') as File
  const serviceId = formData.get('serviceId') as string

  if (!file) {
    throw new Error('No file selected.')
  }

  const extension =
    file.name.split('.').pop() ?? ''

  const fileName = `${randomUUID()}.${extension}`

  const storagePath = `${serviceId}/${fileName}`

  // Upload file to Supabase Storage
  const { error: uploadError } =
    await supabase.storage
      .from('service-documents')
      .upload(storagePath, file, {
        upsert: false,
      })

  if (uploadError) {
    console.error(uploadError)
    throw uploadError
  }

  // Save document record
  const { error: documentError } =
    await supabase
      .from('service_documents')
      .insert({
        service_id: serviceId,
        uploaded_by: user.id,
        uploaded_by_role: 'client',
        file_name: file.name,
        storage_path: storagePath,
        bucket_name: 'service-documents',
        mime_type: file.type,
        file_size: file.size,
       document_type: 'client',
      })

  if (documentError) {
    console.error(documentError)
    throw documentError
  }

  // Activity Log
  await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,
      role: 'client',
      action: 'Document Uploaded',
      description: file.name,
      entity_type: 'service',
      entity_id: serviceId,
    })

  revalidatePath(`/portal/cases/${serviceId}`)
}
