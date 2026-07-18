'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  Mail,
  Lock,
  AlertCircle,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

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
  const [googleLoading, setGoogleLoading] = useState(false)
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
    setGoogleLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/portal`,
      },
    })

    if (error) {
      setGoogleLoading(false)
      setError(error.message)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-6 py-12">

      {/* Background Glow */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute left-[-200px] top-[-150px] h-[500px] w-[500px] rounded-full bg-blue-200/40 blur-[150px]" />

        <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[170px]" />

      </div>

      <div className="relative z-10 w-full max-w-2xl">

        {/* Logo */}

        <div className="mb-8 flex flex-col items-center">

          <Image
            src="/ChatGPT Image Jul 18, 2026, 05_10_52 PM.png"
            alt="POG Advisory"
            width={900}
            height={300}
            priority
            className="h-auto w-full max-w-[480px]"
          />

          <h1 className="mt-5 text-center text-5xl font-bold tracking-tight text-slate-900">
            Client Portal
          </h1>

          <p className="mt-4 max-w-xl text-center text-lg leading-8 text-slate-600">
            Securely manage your accounting services,
            tax documents, compliance requests,
            client communication and business records
            from one place.
          </p>

        </div>

        {/* Login Card */}

        <div className="mx-auto w-full max-w-xl rounded-[32px] border border-white/60 bg-white/90 p-10 shadow-[0_35px_90px_rgba(30,136,229,0.18)] backdrop-blur-2xl">

          <GoogleButton
            label={
              googleLoading
                ? 'Redirecting to Google...'
                : 'Continue with Google'
            }
            onClick={signInWithGoogle}
            disabled={googleLoading}
          />

          <div className="my-8 flex items-center gap-5">

            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              Or continue with email
            </span>

            <div className="h-px flex-1 bg-slate-200" />

          </div>

          {error && (
            <Alert
              variant="destructive"
              className="mb-6"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={signIn}
            className="space-y-7"
          >
                        {/* Email */}

            <div>

              <Label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </Label>

              <div className="relative">

                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-xl border-slate-200 bg-white pl-12 text-base shadow-sm transition focus:border-[#2196F3] focus:ring-[#2196F3]"
                  required
                />

              </div>

            </div>

            {/* Password */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 rounded-xl border-slate-200 bg-white pl-12 text-base shadow-sm transition focus:border-[#2196F3] focus:ring-[#2196F3]"
                  required
                />

              </div>

            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-xl bg-gradient-to-r from-[#2196F3] to-[#1565C0] text-lg font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >

              {loading && (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              )}

              Sign In

            </Button>

          </form>

        </div>

        {/* Bottom Links */}

        <div className="mt-8 flex flex-col items-center gap-3 text-base text-slate-600 md:flex-row md:justify-center">

          <span>
            New to POG Advisory?
          </span>

          <Link
            href="/auth/register"
            className="font-semibold text-[#1E88E5] hover:underline"
          >
            Create an Account
          </Link>

          <span className="hidden text-slate-400 md:block">
            •
          </span>

          <Link
            href="/auth/staff-login"
            className="font-semibold text-[#1E88E5] hover:underline"
          >
            Staff Login
          </Link>

        </div>

      </div>

    </div>
  )
}
