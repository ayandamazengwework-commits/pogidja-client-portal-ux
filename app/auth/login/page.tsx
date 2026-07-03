'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GoogleButton } from '@/components/brand/google-button'
import { Logo } from '@/components/brand/logo'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('john.smith@brightwave.co.za')
  const [password, setPassword] = useState('demo1234')
  const [loading, setLoading] = useState(false)

  function signIn(e?: React.FormEvent) {
    e?.preventDefault()

    setLoading(true)

    setTimeout(() => {
      router.push('/portal')
    }, 700)
  }

  return (
    <div className="w-full max-w-md">

      {/* Logo */}

      <div className="mb-10 flex flex-col items-center text-center">

        <Logo />

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
          POG Advisory Portal
        </h1>

        <p className="mt-2 text-slate-600">
          Client Portal —{' '}
          <Link
            href="/staff/login"
            className="font-medium text-[#1E88E5] hover:underline"
          >
            Staff login
          </Link>
        </p>

      </div>

      {/* Card */}

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        <GoogleButton onClick={signIn} />

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs uppercase tracking-wide text-slate-500">
            Or continue with email
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={signIn} className="space-y-5">

          <div>
            <Label htmlFor="email">
              Email address
            </Label>

            <Input
              id="email"
              type="email"
              className="mt-2 h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>

            <div className="mb-2 flex items-center justify-between">

              <Label htmlFor="password">
                Password
              </Label>

              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#1E88E5] hover:underline"
              >
                Forgot password?
              </Link>

            </div>

            <Input
              id="password"
              type="password"
              className="h-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 h-11 w-full bg-[#1E88E5] hover:bg-[#1565C0]"
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            Sign In
          </Button>

        </form>

      </div>

      <p className="mt-8 text-center text-sm text-slate-600">
        New to Pogidja?{' '}
        <Link
          href="/auth/register"
          className="font-medium text-[#1E88E5] hover:underline"
        >
          Create an account
        </Link>
      </p>

    </div>
  )
}
