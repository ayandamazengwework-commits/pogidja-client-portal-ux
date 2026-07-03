'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import { Logo } from '@/components/brand/logo'
import { GoogleButton } from '@/components/brand/google-button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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

    router.push('/portal')
    router.refresh()
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="relative z-20 w-full max-w-xl">
      <div className="mb-10 flex flex-col items-center">
        <Logo />

        <h1 className="mt-7 text-center text-5xl font-extrabold tracking-tight text-slate-900">
          POG
          <span className="text-[#1E88E5]"> Advisory </span>
          Portal
        </h1>

        <p className="mt-3 text-lg text-slate-600">
          Client Portal —
          <Link
            href="/staff/login"
            className="ml-2 font-semibold text-[#1E88E5] hover:underline"
          >
            Staff login
          </Link>
        </p>
      </div>

      <div className="rounded-[30px] border border-white/60 bg-white/90 p-10 shadow-[0_30px_80px_rgba(30,136,229,0.18)] backdrop-blur-xl">
        <GoogleButton
          label="Continue with Google"
          onClick={signInWithGoogle}
        />

        <div className="my-8 flex items-center gap-5">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Or continue with email
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={signIn}
          className="space-y-6"
        >
          <div>
            <Label htmlFor="email">
              Email address
            </Label>

            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-14 rounded-xl border-slate-200 pl-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label htmlFor="password">
                Password
              </Label>

              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-[#1E88E5] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                className="h-14 rounded-xl border-slate-200 pl-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            disabled={loading}
            type="submit"
            className="mt-4 h-14 w-full rounded-xl bg-gradient-to-r from-[#2196F3] to-[#1565C0] text-lg font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            {loading && (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            )}

            Sign In
          </Button>
        </form>
      </div>

      <p className="mt-8 text-center text-base text-slate-600">
        New to Pogidja?

        <Link
          href="/auth/register"
          className="ml-2 font-semibold text-[#1E88E5] hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}
