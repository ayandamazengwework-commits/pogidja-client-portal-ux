'use client'

import { useRef, useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function UploadInvoice({
  invoiceId,
}: {
  invoiceId: string
}) {
  const supabase = createClient()

  const inputRef = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]

    if (!file) return

    setUploading(true)

    try {
      const fileName = `${invoiceId}-${Date.now()}-${file.name}`

      const { error: storageError } = await supabase.storage
        .from('invoice-pdfs')
        .upload(fileName, file, {
          upsert: true,
        })

      if (storageError) throw storageError
await supabase
  .from('invoices')
  .update({
    invoice_url: fileName,
  })
  .eq('id', invoiceId)

      if (updateError) throw updateError

      window.location.reload()
    } catch (err) {
      console.error(err)
      alert('Failed to upload invoice.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        hidden
        onChange={handleUpload}
      />

      <Button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Invoice
          </>
        )}
      </Button>
    </>
  )
}
