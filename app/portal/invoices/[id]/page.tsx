import { notFound } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import { UploadProofForm } from '@/components/portal/upload-proof-form'

export default async function UploadProofPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single()

  if (!invoice) {
    notFound()
  }

  return (
    <UploadProofForm
      invoice={invoice}
    />
  )
}
