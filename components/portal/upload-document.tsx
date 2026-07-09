'use client'

import { useRef, useState, useTransition } from 'react'
import { Upload, Loader2 } from 'lucide-react'

import { uploadDocument } from '@/app/portal/cases/[id]/actions'

import { Button } from '@/components/ui/button'

interface Props {
  serviceId: string
}

export function UploadDocument({
  serviceId,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [isPending, startTransition] =
    useTransition()

  const [error, setError] =
    useState<string | null>(null)

  function submit() {
    const file =
      inputRef.current?.files?.[0]

    if (!file) return

    const formData = new FormData()

    formData.append('file', file)
    formData.append('serviceId', serviceId)

    startTransition(async () => {
      setError(null)

      try {
        await uploadDocument(formData)

      } catch (err) {
        setError('Upload failed.')
      }
    })
  }

  return (
    <div className="space-y-4">

      <input
        ref={inputRef}
        type="file"
        onChange={submit}
        className="hidden"
      />

      <Button
        type="button"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </>
        )}
      </Button>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

    </div>
  )
}
