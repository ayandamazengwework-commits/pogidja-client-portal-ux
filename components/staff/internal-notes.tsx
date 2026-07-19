'use client'

import { useState, useTransition } from 'react'
import { StickyNote } from 'lucide-react'

import { saveInternalNotes } from '@/app/staff/services/actions'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  serviceId: string
  initialNotes: string | null
}

export function InternalNotes({
  serviceId,
  initialNotes,
}: Props) {
  const [notes, setNotes] = useState(initialNotes ?? '')
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function save() {
    startTransition(async () => {
      setSaved(false)

      await saveInternalNotes(
        serviceId,
        notes
      )

      setSaved(true)

      setTimeout(() => {
        setSaved(false)
      }, 2500)
    })
  }

  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm space-y-6">

      <div className="flex items-center gap-3">

        <StickyNote className="h-6 w-6 text-blue-600" />

        <div>

          <h2 className="text-2xl font-bold">
            Internal Notes
          </h2>

          <p className="text-sm text-slate-500">
            Only staff can see these notes.
          </p>

        </div>

      </div>

      <Textarea
        rows={10}
        value={notes}
        onChange={(e) =>
          setNotes(e.target.value)
        }
        placeholder="Write internal notes..."
      />

      <div className="flex items-center justify-between">

        <span className="text-sm text-green-600">
          {saved && 'Saved'}
        </span>

        <Button
          disabled={pending}
          onClick={save}
        >
          {pending
            ? 'Saving...'
            : 'Save Notes'}
        </Button>

      </div>

    </div>
  )
}
