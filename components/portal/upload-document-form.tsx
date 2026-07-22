'use client'

import { useRef, useState, useTransition } from 'react'
import { Upload, Loader2 } from 'lucide-react'

import { uploadDocument } from '@/app/portal/cases/[id]/actions'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function UploadDocumentForm({
  serviceId,
}: {
  serviceId: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('General')

  const [pending, startTransition] = useTransition()

  function upload() {
    const file = inputRef.current?.files?.[0]

    if (!file) return

    const formData = new FormData()

    formData.append('serviceId', serviceId)
    formData.append('title', title)
    formData.append('category', category)
    formData.append('file', file)

    startTransition(async () => {
      await uploadDocument(formData)

      setTitle('')
      setCategory('General')

      if (inputRef.current) {
        inputRef.current.value = ''
      }
    })
  }

  return (
    <Card className="rounded-3xl">

      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">

        <div>
          <Label>Document Title</Label>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tax Clearance Certificate"
          />
        </div>

        <div>
          <Label>Category</Label>

          <select
            className="mt-2 w-full rounded-xl border p-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>General</option>
            <option>Tax</option>
            <option>Bank Statements</option>
            <option>Financial Statements</option>
            <option>SARS</option>
            <option>ID</option>
            <option>Other</option>
          </select>
        </div>

        <input
          ref={inputRef}
          type="file"
        />

        <Button
          onClick={upload}
          disabled={pending}
          className="w-full"
        >
          {pending ? (
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

      </CardContent>

    </Card>
  )
}
