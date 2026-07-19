'use client'

import { useState, useTransition } from 'react'
import { Save } from 'lucide-react'

import { updateServiceNotes } from '@/app/staff/services/actions'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  serviceId: string
  notes: string | null
}

export function ServiceNotes({
  serviceId,
  notes,
}: Props) {
  const [value, setValue] = useState(notes ?? '')
  const [pending, startTransition] = useTransition()

  return (
    <div className="space-y-4">

      <Textarea
        rows={8}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Internal staff notes..."
      />

      <div className="flex justify-end">

        <Button
          disabled={pending}
          onClick={() =>
            startTransition(() =>
              updateServiceNotes(serviceId, value)
            )
          }
        >
          <Save className="mr-2 h-4 w-4" />

          {pending ? 'Saving...' : 'Save Notes'}
        </Button>

      </div>

    </div>
  )
}
