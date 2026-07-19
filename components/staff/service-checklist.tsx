'use client'

import { useTransition } from 'react'
import { CheckCircle2 } from 'lucide-react'

import { toggleChecklistItem } from '@/app/staff/services/actions'

interface Item {
  id: string
  title: string
  completed: boolean
}

interface Props {
  serviceId: string
  items: Item[]
}

export function ServiceChecklist({
  serviceId,
  items,
}: Props) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="space-y-4">

      {items.length === 0 && (
        <div className="rounded-2xl border border-dashed p-8 text-center text-slate-500">
          No checklist created yet.
        </div>
      )}

      {items.map((item) => (
        <button
          key={item.id}
          disabled={pending}
          onClick={() =>
            startTransition(() =>
              toggleChecklistItem(serviceId, item.id)
            )
          }
          className={`flex w-full items-center justify-between rounded-2xl border p-5 transition ${
            item.completed
              ? 'border-green-200 bg-green-50'
              : 'bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-4">

            <CheckCircle2
              className={`h-6 w-6 ${
                item.completed
                  ? 'text-green-600'
                  : 'text-slate-300'
              }`}
            />

            <span
              className={
                item.completed
                  ? 'line-through text-slate-500'
                  : 'font-medium'
              }
            >
              {item.title}
            </span>

          </div>

          <span className="text-sm text-slate-500">
            {item.completed ? 'Completed' : 'Pending'}
          </span>

        </button>
      ))}

    </div>
  )
}
