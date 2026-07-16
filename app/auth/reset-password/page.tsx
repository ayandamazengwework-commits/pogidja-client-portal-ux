'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2, CheckCircle2 } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    setTimeout(() => {
      router.push('/auth/login')
    }, 2500)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-6">

      <Card className="w-full rounded-3xl">

        <CardHeader>

          <CardTitle className="text-3xl">
            Reset Password
          </CardTitle>

          <CardDescription>
            Choose a new password for your account.
          </CardDescription>

        </CardHeader>

        <CardContent>

          {success ? (

            <div className="space-y-6 text-center">

              <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />

              <h2 className="text-2xl font-bold">
                Password Updated
              </h2>

              <p className="text-muted-foreground">
                Your password has been changed successfully.
              </p>

              <p className="text-sm text-slate-500">
                Redirecting to login...
              </p>

            </div>

          ) : (

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div>

                <Label>New Password</Label>

                <div className="relative mt-2">

                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <Input
                    type="password"
                    className="h-12 pl-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                </div>

              </div>

              <div>

                <Label>Confirm Password</Label>

                <div className="relative mt-2">

                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <Input
                    type="password"
                    className="h-12 pl-12"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />

                </div>

              </div>

              {error && (
                <p className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <Button
                className="w-full h-12"
                disabled={loading}
              >

                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                Update Password

              </Button>

            </form>

          )}

        </CardContent>

      </Card>

    </div>
  )
}
