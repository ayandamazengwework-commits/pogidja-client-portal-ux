'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { uploadProofOfPayment } from '@/app/staff/invoices/actions'

export function UploadProofOfPayment({
  invoiceId,
}: {
  invoiceId: string
}) {
  const [loading, setLoading] = useState(false)

  return (
    <form
      action={async (formData) => {
        setLoading(true)
        await uploadProofOfPayment(formData)
        setLoading(false)
      }}
    >
      <input
        type="hidden"
        name="invoiceId"
        value={invoiceId}
      />

      <input
        type="file"
        name="file"
        required
        className="mb-3 block"
      />

      <Button disabled={loading}>
        <Upload className="mr-2 h-4 w-4" />

        {loading
          ? 'Uploading...'
          : 'Upload Proof'}
      </Button>
    </form>
  )
}
