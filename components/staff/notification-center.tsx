'use client'

import { Bell } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  created_at: string
  read: boolean
}

interface Props {
  notifications: Notification[]
}

export function NotificationCenter({
  notifications,
}: Props) {
  return (
    <div className="rounded-3xl border bg-white shadow-sm">

      <div className="border-b p-6">

        <div className="flex items-center gap-3">

          <Bell className="h-6 w-6 text-blue-600" />

          <div>

            <h2 className="text-2xl font-bold">
              Notifications
            </h2>

            <p className="text-sm text-slate-500">
              Recent activity across the portal.
            </p>

          </div>

        </div>

      </div>

      <div className="divide-y">

        {notifications.length === 0 && (

          <div className="p-12 text-center text-slate-500">

            No notifications yet.

          </div>

        )}

        {notifications.map((notification) => (

          <div
            key={notification.id}
            className={`p-6 ${
              notification.read
                ? 'bg-white'
                : 'bg-blue-50'
            }`}
          >

            <div className="flex items-start justify-between">

              <div>

                <h3 className="font-semibold">
                  {notification.title}
                </h3>

                <p className="mt-2 text-slate-600">
                  {notification.message}
                </p>

              </div>

              {!notification.read && (
                <span className="h-3 w-3 rounded-full bg-blue-600" />
              )}

            </div>

            <p className="mt-4 text-xs text-slate-400">
              {new Date(
                notification.created_at
              ).toLocaleString()}
            </p>

          </div>

        ))}

      </div>

    </div>
  )
}
