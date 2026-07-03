'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ShieldCheck } from 'lucide-react'

export default function StaffLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('thandiwe@pogidja.co.za')
  const [password, setPassword] = useState('demo1234')
  const [loading, setLoading] = useState(false)

  function signIn(e?: React.FormEvent) {
    e?.preventDefault()
    setLoading(true)
    setTimeout(() => router.push('/staff'), 700)
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
              <h1 className="text-lg font-bold tracking-tight">Staff Portal</h1>
              <p className="text-xs text-muted-foreground">
                Practice management sign in
              </p>
            </div>
          </div>

          <form onSubmit={signIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Protected practice environment. Authorised personnel only.
        </p>
      </div>
    </div>
  )
}
