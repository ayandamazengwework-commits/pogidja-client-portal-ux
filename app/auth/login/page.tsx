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

import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert'
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

    const { error } =
      await supabase.auth.signInWithPassword({
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

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-6 py-10">

      {/* Background */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-200/40 blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-blue-400/20 blur-[160px]" />

      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}

        <div className="mb-8 flex flex-col items-center">

          <Image
  src="/ChatGPT Image Jul 18, 2026, 05_10_52 PM.png"
  alt="POG Advisory"
  width={300}
  height={300}
  priority
  className="w-56 sm:w-64 md:w-72 h-auto"
/>

          <h1 className="mt-6 text-center text-3xl font-bold text-slate-900">
            Client Portal
          </h1>

          <p className="mt-3 text-center text-slate-600">
            Secure access to your accounting
            services, tax documents and client
            requests.
          </p>

        </div>

        {/* Login Card */}

        <div className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow-[0_30px_80px_rgba(30,136,229,0.18)] backdrop-blur-xl">

          {error && (
            <Alert
              variant="destructive"
              className="mb-6"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={signIn}
            className="space-y-5"
          >

            {/* Email */}

            <div>

              <Label htmlFor="email">
                Email Address
              </Label>

              <div className="relative mt-2">

                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-14 rounded-xl pl-12"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* Password */}

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
                  className="h-14 rounded-xl pl-12"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-xl bg-gradient-to-r from-[#2196F3] to-[#1565C0] text-lg font-semibold shadow-lg hover:-translate-y-0.5 transition"
            >

              {loading && (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              )}

              Sign In

            </Button>

          </form>

        </div>

        {/* Footer Links */}

        <div className="mt-8 text-center">

          <p className="text-slate-600">
            New to POG Advisory?
          </p>

          <Link
            href="/auth/register"
            className="mt-2 block font-semibold text-[#1E88E5] hover:underline"
          >
            Create an Account
          </Link>

          <Link
            href="/auth/staff-login"
            className="mt-5 inline-block text-sm font-medium text-slate-600 hover:text-[#1E88E5]"
          >
            Staff Login
          </Link>

        </div>

      </div>

    </div>
  )
}
