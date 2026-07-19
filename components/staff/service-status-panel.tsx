'use client'

import { useState, useTransition } from 'react'
import { Loader2, Save } from 'lucide-react'

import { updateService } from '@/app/staff/services/actions'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ServiceStatusPanelProps {
  service: {
    id: string
    status: string
    priority: string
    progress: number | null
    due_date: string | null
    assigned_to: string |null
  }
}

export function ServiceStatusPanel({
  service,
}: ServiceStatusPanelProps) {
  const [isPending, startTransition] = useTransition()

  const [status, setStatus] = useState(service.status)
  const [priority, setPriority] = useState(service.priority)
  const [progress, setProgress] = useState(
    service.progress ?? 0
  )
  const [dueDate, setDueDate] = useState(
    service.due_date ?? ''
  )

  return (
    <Card className="rounded-3xl border-0 shadow-lg">
      <CardContent className="p-8">

        <div className="mb-8">

          <h2 className="text-2xl font-bold">
            Service Management
          </h2>

          <p className="mt-1 text-slate-500">
            Update this service and notify the client.
          </p>

        </div>

        <form
          action={(formData) => {
            startTransition(async () => {
              await updateService(formData)
            })
          }}
          className="space-y-8"
        >
          <input
            type="hidden"
            name="serviceId"
            value={service.id}
          />

          <div className="grid gap-6 lg:grid-cols-2">

            <div>

              <Label>Status</Label>

              <select
                name="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4"
              >
                <option>Pending</option>
                <option>Awaiting Documents</option>
                <option>In Progress</option>
                <option>In Review</option>
                <option>Completed</option>
              </select>

            </div>

            <div>

              <Label>Priority</Label>

              <select
                name="priority"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
                className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4"
              >
                <option>Low</option>
                <option>Normal</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>

            </div>

            <div>

              <Label>Progress (%)</Label>

              <Input
                type="number"
                min={0}
                max={100}
                name="progress"
                value={progress}
                onChange={(e) =>
                  setProgress(Number(e.target.value))
                }
                className="mt-2 h-12"
              />

            </div>

            <div>

              <Label>Due Date</Label>

              <Input
                type="date"
                name="due_date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
                className="mt-2 h-12"
              />

            </div>

          </div>

          <div className="flex justify-end">

            <Button
              type="submit"
              disabled={isPending}
              className="h-12 rounded-xl px-8"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>

          </div>

        </form>

      </CardContent>
    </Card>
  )
}
