'use client'

import { createDocumentRequest } from '@/app/staff/services/document-request/actions'

import { Button } from '@/components/ui/button'

export function DocumentRequestForm({
  serviceId,
  clientId,
}: {
  serviceId: string
  clientId: string
}) {
  return (
    <form
      action={createDocumentRequest}
      className="space-y-4 rounded-2xl border p-6"
    >
      <input
        type="hidden"
        name="service_id"
        value={serviceId}
      />

      <input
        type="hidden"
        name="client_id"
        value={clientId}
      />

      <h3 className="text-xl font-semibold">
        Request Document
      </h3>

      <input
        required
        name="title"
        placeholder="Document Name"
        className="w-full rounded-xl border p-3"
      />

      <textarea
        rows={3}
        name="description"
        placeholder="Instructions..."
        className="w-full rounded-xl border p-3"
      />

      <Button className="w-full">
        Send Request
      </Button>
    </form>
  )
}
