'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'


export default function UpdatePasswordPage() {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


  async function updatePassword() {
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/portal')
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

      <Card className="w-full max-w-md rounded-3xl">

        <CardHeader>
          <CardTitle className="text-2xl">
            Create Your Password
          </CardTitle>

          <p className="text-sm text-slate-500">
            Welcome to POG Advisory. Set your password to activate your client portal.
          </p>
        </CardHeader>


        <CardContent className="space-y-5">

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}


          <div>
            <Label>
              New Password
            </Label>

            <Input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>


          <div>
            <Label>
              Confirm Password
            </Label>

            <Input
              type="password"
              value={confirm}
              onChange={(e)=>setConfirm(e.target.value)}
            />
          </div>


          <Button
            className="w-full h-12"
            onClick={updatePassword}
            disabled={loading}
          >
            {loading
              ? 'Creating Password...'
              : 'Activate Portal'}
          </Button>

        </CardContent>

      </Card>

    </div>
  )
}
