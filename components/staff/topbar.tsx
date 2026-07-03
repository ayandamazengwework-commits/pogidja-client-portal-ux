'use client'

import { Bell, Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function StaffTopbar() {
  const today = new Date().toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">

      <div className="flex h-20 items-center justify-between px-8">

        <div>

          <h1 className="text-2xl font-bold">
            Dashboard
          </h1>

          <p className="text-sm text-slate-500">
            {today}
          </p>

        </div>

        <div className="flex items-center gap-4">

          <div className="relative">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              placeholder="Search clients, services..."
              className="w-80 pl-10"
            />

          </div>

          <Button
            variant="outline"
            size="icon"
          >
            <Bell className="h-5 w-5" />
          </Button>

        </div>

      </div>

    </header>
  )
}
