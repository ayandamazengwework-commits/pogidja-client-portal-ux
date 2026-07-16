'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }

    setLoading(false)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <Card className="w-full rounded-3xl">
        <CardHeader>
          <CardTitle className="text-3xl">
            Forgot Password
          </CardTitle>

          <CardDescription>
            Enter your email and we'll send you a secure password reset link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {sent ? (
            <div className="space-y-6 text-center">

              <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />

              <h2 className="text-2xl font-bold">
                Email Sent
              </h2>

              <p className="text-muted-foreground">
                Check your inbox for your password reset email.
              </p>

              <Button asChild className="w-full">
                <Link href="/auth/login">
                  Return to Login
                </Link>
              </Button>

            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div>
                <Label>Email Address</Label>

                <div className="relative mt-2">

                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <Input
                    type="email"
                    required
                    className="h-12 pl-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                disabled={loading}
                className="w-full h-12"
              >
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                Send Reset Link

              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full"
              >
                <Link href="/auth/login">

                  <ArrowLeft className="mr-2 h-4 w-4" />

                  Back to Login

                </Link>
              </Button>

            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
