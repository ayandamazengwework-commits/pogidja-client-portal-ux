'use client'

import { useState } from 'react'

import { createChecklistItem } from '@/app/staff/services/actions'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  serviceId: string
}

export function NewChecklistItem({
  serviceId,
}: Props) {
  const [title, setTitle] = useState('')

  return (
    <form
      action={async () => {
        if (!title.trim()) return

        await createChecklistItem(
          serviceId,
          title
        )

        setTitle('')
      }}
      className="flex gap-3"
    >
      <Input
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        placeholder="Add checklist item..."
      />

      <Button type="submit">
        Add
      </Button>
    </form>
  )
}
