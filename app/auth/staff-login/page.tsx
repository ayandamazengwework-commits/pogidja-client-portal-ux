'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  Mail,
  Lock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function StaffLoginPage() {
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

    router.push('/staff')
    router.refresh()
  }

  return (
    <div className="relative z-20 w-full max-w-xl">

      {/* ================= LOGO ================= */}

      <div className="mb-10 flex flex-col items-center">

        <Image
          src="/ChatGPT Image Jul 18, 2026, 05_10_52 PM.png"
          alt="POG Advisory"
          width={520}
          height={180}
          priority
          className="h-auto w-full max-w-[430px] object-contain"
        />

        <div className="mt-8 flex items-center gap-3">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-[#2196F3] to-[#1565C0] text-white shadow-lg">

            <ShieldCheck className="h-7 w-7" />

          </div>

          <div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Staff Portal
            </h1>

            <p className="text-slate-600">
              Internal Practice Management
            </p>

          </div>

        </div>

      </div>

      {/* ================= LOGIN CARD ================= */}

      <div className="rounded-[30px] border border-white/60 bg-white/90 p-10 shadow-[0_30px_80px_rgba(30,136,229,0.18)] backdrop-blur-xl">

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
          className="space-y-6"
        >

          <div>

            <Label htmlFor="email">
              Staff Email
            </Label>

            <div className="relative mt-2">

              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="staff@pogadvisory.co.za"
                className="h-14 rounded-xl border-slate-200 pl-12"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

          </div>

          <div>

            <Label htmlFor="password">
              Password
            </Label>

            <div className="relative mt-2">

              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                className="h-14 rounded-xl border-slate-200 pl-12"
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
            className="h-14 w-full rounded-xl bg-gradient-to-r from-[#2196F3] to-[#1565C0] text-lg font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >

            {loading && (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            )}

            Sign In to Dashboard

          </Button>

        </form>

      </div>

      {/* ================= CLIENT LOGIN ================= */}

      <p className="mt-8 text-center text-base text-slate-600">

        Looking for the client portal?

        <Link
          href="/auth/login"
          className="ml-2 font-semibold text-[#1E88E5] hover:underline"
        >
          Client Sign In
        </Link>

      </p>

    </div>
  )
}
