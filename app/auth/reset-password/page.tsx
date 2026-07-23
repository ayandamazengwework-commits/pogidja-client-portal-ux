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


    // Check that Supabase has an active invitation session
    const {
      data: { session },
    } = await supabase.auth.getSession()


    console.log('PASSWORD SESSION:', session)


    if (!session) {
      setError(
        'Your invitation session has expired. Please request a new invitation.'
      )
      setLoading(false)
      return
    }


    const { error: updateError } =
      await supabase.auth.updateUser({
        password,
      })


    if (updateError) {
      console.error(updateError)

      setError(updateError.message)
      setLoading(false)
      return
    }


    // Mark invitation as accepted
    await supabase
      .from('profiles')
      .update({
        invitation_accepted: true,
      })
      .eq('id', session.user.id)


    setSuccess(true)
    setLoading(false)


    setTimeout(() => {
      router.push('/portal')
    }, 2500)
  }


  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-6">

      <Card className="w-full rounded-3xl">

        <CardHeader>

          <CardTitle className="text-3xl">
            Create Your Password
          </CardTitle>

          <CardDescription>
            Welcome to POG Advisory. Set your password to activate your client portal.
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
                Your client portal has been activated successfully.
              </p>

              <p className="text-sm text-slate-500">
                Redirecting to your portal...
              </p>

            </div>

          ) : (

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div>

                <Label>
                  New Password
                </Label>

                <div className="relative mt-2">

                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <Input
                    type="password"
                    className="h-12 pl-12"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                </div>

              </div>


              <div>

                <Label>
                  Confirm Password
                </Label>

                <div className="relative mt-2">

                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <Input
                    type="password"
                    className="h-12 pl-12"
                    value={confirm}
                    onChange={(e) =>
                      setConfirm(e.target.value)
                    }
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
                type="submit"
                className="h-12 w-full"
                disabled={loading}
              >

                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                {loading
                  ? 'Updating Password...'
                  : 'Activate Portal'}

              </Button>


            </form>

          )}

        </CardContent>

      </Card>

    </div>
  )
}
