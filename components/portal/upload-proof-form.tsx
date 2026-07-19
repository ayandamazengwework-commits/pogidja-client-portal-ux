'use client'

import { useState } from 'react'

import { uploadProofOfPayment } from '@/app/portal/invoices/actions'

import { createClient } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export function UploadProofForm({
  invoice,
}: {
  invoice: any
}) {
  const supabase = createClient()

  const [uploading, setUploading] = useState(false)

  async function handleUpload(
    formData: FormData
  ) {
    setUploading(true)

    const file = formData.get('file') as File

    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from('documents')
      .upload(fileName, file)

    if (error) {
      alert(error.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName)

    formData.set(
      'proof_url',
      data.publicUrl
    )

    await uploadProofOfPayment(formData)
  }

  return (
    <Card className="mx-auto max-w-2xl rounded-3xl">

      <CardContent className="space-y-8 p-8">

        <h1 className="text-3xl font-bold">

          Upload Proof Of Payment

        </h1>

        <form
          action={handleUpload}
          className="space-y-6"
        >

          <input
            type="hidden"
            name="invoice_id"
            value={invoice.id}
          />

          <Label>

            PDF / Image

          </Label>

          <input
            required
            type="file"
            name="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="block w-full rounded-xl border p-3"
          />

          <Button
            disabled={uploading}
            className="w-full"
          >

            {uploading
              ? 'Uploading...'
              : 'Upload Proof'}

          </Button>

        </form>

      </CardContent>

    </Card>
  )
}
