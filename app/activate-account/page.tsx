'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Loader2 } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert'

export default function ActivateAccountPage() {
  const router = useRouter()
  const params = useSearchParams()

  const supabase = createClient()

  const email = params.get('email') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function activate(e: React.FormEvent) {
    e.preventDefault()

    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/portal')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <h1 className="text-3xl font-bold">
          Activate Account
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome to the POG Advisory Client Portal.
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">

          <p className="text-sm text-slate-500">
            Email
          </p>

          <p className="font-semibold">
            {email}
          </p>

        </div>

        {error && (
          <Alert
            variant="destructive"
            className="mt-5"
          >
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={activate}
          className="mt-6 space-y-5"
        >

          <div>

            <Label>Password</Label>

            <div className="relative mt-2">

              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                type="password"
                required
                className="pl-12 h-12"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

            </div>

          </div>

          <div>

            <Label>Confirm Password</Label>

            <div className="relative mt-2">

              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                type="password"
                required
                className="pl-12 h-12"
                value={confirm}
                onChange={(e) =>
                  setConfirm(e.target.value)
                }
              />

            </div>

          </div>

          <Button
            className="w-full h-12"
            disabled={loading}
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            Activate Account
          </Button>

        </form>

      </div>

    </div>
  )
}
