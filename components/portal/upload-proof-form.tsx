'use client'

import { uploadProofOfPayment } from '@/app/portal/invoices/actions'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function UploadProofForm({
  invoice,
}: {
  invoice: any
}) {
  return (
    <Card className="mx-auto max-w-2xl rounded-3xl">

      <CardContent className="space-y-8 p-8">

        <h1 className="text-3xl font-bold">

          Upload Proof of Payment

        </h1>

        <form
          action={uploadProofOfPayment}
          className="space-y-6"
        >

          <input
            type="hidden"
            name="invoice_id"
            value={invoice.id}
          />

          <div>

            <Label>

              Proof of Payment URL

            </Label>

            <Input
              name="proof_url"
              placeholder="https://..."
              required
            />

          </div>

          <Button className="w-full">

            Submit Proof

          </Button>

        </form>

      </CardContent>

    </Card>
  )
}
