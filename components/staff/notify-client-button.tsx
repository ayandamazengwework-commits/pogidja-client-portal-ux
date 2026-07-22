'use client'

import { useTransition } from 'react'
import { Bell } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { notifyClient } from '@/app/staff/services/actions'

interface NotifyClientButtonProps {
  serviceId: string
  clientId: string
}

export function NotifyClientButton({
  serviceId,
  clientId,
}: NotifyClientButtonProps) {
  const [pending, startTransition] = useTransition()

  function sendNotification() {
    startTransition(async () => {
      try {
        await notifyClient(serviceId, clientId)

        alert('Client notified successfully.')
      } catch (error) {
        console.error(error)
        alert('Failed to notify client.')
      }
    })
  }

  return (
    <Button
      type="button"
      disabled={pending}
      onClick={sendNotification}
      className="gap-2"
    >
      <Bell className="h-4 w-4" />

      {pending ? 'Sending...' : 'Notify Client'}
    </Button>
  )
}
