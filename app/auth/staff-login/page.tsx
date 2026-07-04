'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import { Logo } from '@/components/brand/logo'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function StaffLoginPage() {
  const router = useRouter()
  const supabase = createClient()

  // Keep demo values pre-filled for now
  const [email, setEmail] = useState('owner@pogadvisory.co.za')
  const [password, setPassword] = useState('POGAdmin2026!')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function signIn(e?: React.FormEvent) {
    e?.preventDefault()

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setLoading(false)
      setError(error.message)
      return
    }

    router.push('/staff')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar p-6">
      <div className="w-full max-w-md">

        <div className="mb-8 flex justify-center">
          <Logo variant="light" />
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">

          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </span>

            <div>
              <h1 className="text-lg font-bold">
                Staff Portal
              </h1>

              <p className="text-xs text-muted-foreground">
                Practice management sign in
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={signIn} className="space-y-4">

            <div>
              <Label>Email</Label>

              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>Password</Label>

              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              Sign in to dashboard
            </Button>

          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Looking for the client portal?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Client sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
