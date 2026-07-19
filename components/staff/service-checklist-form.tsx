'use client'

import { useState, useTransition } from 'react'

import { createChecklistItem } from '@/app/staff/services/actions'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  serviceId: string
}

export function ServiceChecklistForm({
  serviceId,
}: Props) {
  const [title, setTitle] = useState('')
  const [pending, startTransition] = useTransition()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()

        if (!title.trim()) return

        startTransition(async () => {
          await createChecklistItem(serviceId, title)

          setTitle('')
        })
      }}
      className="flex gap-3"
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add checklist item..."
      />

      <Button
        type="submit"
        disabled={pending}
      >
        Add
      </Button>
    </form>
  )
}
