'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'

import { requestDocuments } from '@/app/staff/services/document-request-actions'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  serviceId: string
  clientId: string
}

export function DocumentRequestForm({
  serviceId,
  clientId,
}: Props) {
  const [pending, startTransition] = useTransition()

  const [documents, setDocuments] = useState('')

  return (
    <Card className="rounded-3xl border-0 shadow-sm">

      <CardContent className="space-y-6 p-8">

        <div>

          <h2 className="text-2xl font-bold">
            Request Documents
          </h2>

          <p className="mt-2 text-slate-500">
            Send a document request directly to the client.
          </p>

        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()

            startTransition(async () => {
              await requestDocuments({
                serviceId,
                clientId,
                documents,
              })

              setDocuments('')
            })
          }}
          className="space-y-5"
        >

          <div>

            <Label>
              Requested Documents
            </Label>

            <Textarea
              rows={8}
              placeholder={`Example:

• ID Copy

• SARS Tax Number

• Company Registration Documents

• Bank Statement

• Proof of Address`}
              value={documents}
              onChange={(e) =>
                setDocuments(e.target.value)
              }
            />

          </div>

          <Button
            disabled={pending}
            type="submit"
          >

            {pending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            Send Request

          </Button>

        </form>

      </CardContent>

    </Card>
  )
}
