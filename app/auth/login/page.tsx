'use client'

import {
  useState,
} from 'react'

import Image from 'next/image'
import Link from 'next/link'
import {
  useRouter,
} from 'next/navigation'

import {
  Loader2,
  KeyRound,
  AlertCircle,
} from 'lucide-react'

import {
  sendClientOTP,
} from '@/app/auth/actions'


import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert'

import {
  Button,
} from '@/components/ui/button'

import {
  Input,
} from '@/components/ui/input'

import {
  Label,
} from '@/components/ui/label'


export default function LoginPage() {

  const router = useRouter()


  const [
    reference,
    setReference,
  ] = useState('')


  const [
    loading,
    setLoading,
  ] = useState(false)


  const [
    error,
    setError,
  ] = useState<string | null>(null)



  async function continueLogin(
    e: React.FormEvent
  ) {

    e.preventDefault()

    setLoading(true)
    setError(null)


    const result =
      await sendClientOTP(
        reference
      )


    if (
      result.error
    ) {

      setLoading(false)
      setError(
        result.error
      )

      return
    }


    sessionStorage.setItem(
      'pog_login_email',
      result.email!
    )


    router.push(
      '/auth/verify'
    )

  }


  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-6 py-10">


      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-200/40 blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-blue-400/20 blur-[160px]" />

      </div>


      <div className="relative z-10 w-full max-w-5xl">


        <div className="mb-5 flex flex-col items-center">


          <Image
            src="/ChatGPT Image Jul 18, 2026, 05_10_52 PM.png"
            alt="POG Advisory"
            width={320}
            height={320}
            priority
            className="h-auto w-52 sm:w-60 md:w-64"
          />


          <h1 className="mt-2 text-center text-3xl font-bold text-slate-900 sm:text-4xl">
            Client Portal
          </h1>


          <p className="mt-2 max-w-xl text-center text-slate-600">
            Secure access to your accounting services,
            tax documents, compliance requests and
            client communication.
          </p>


        </div>


        <div className="mx-auto w-full max-w-2xl rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[0_30px_80px_rgba(30,136,229,0.18)] backdrop-blur-xl sm:p-8">
                    {error && (
            <Alert
              variant="destructive"
              className="mb-5"
            >
              <AlertCircle className="h-4 w-4" />

              <AlertDescription>
                {error}
              </AlertDescription>

            </Alert>
          )}



          <form
            onSubmit={continueLogin}
            className="space-y-5"
          >


            <div>

              <Label htmlFor="reference">
                Client Reference
              </Label>


              <div className="relative mt-2">


                <KeyRound
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                />


                <Input
                  id="reference"
                  placeholder="POG-XXXX-XXXX"
                  className="h-14 rounded-xl pl-12 uppercase"
                  value={reference}
                  onChange={(e) =>
                    setReference(
                      e.target.value
                    )
                  }
                  required
                />


              </div>


              <p className="mt-3 text-sm text-slate-500">
                Your Client Reference can be found in your POG Advisory welcome email.
              </p>


            </div>



            <Button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-xl bg-gradient-to-r from-[#2196F3] to-[#1565C0] text-lg font-semibold shadow-lg transition-all hover:-translate-y-0.5"
            >

              {loading && (
                <Loader2
                  className="mr-2 h-5 w-5 animate-spin"
                />
              )}


              Continue


            </Button>



          </form>


        </div>



        <div className="mt-6 flex flex-col items-center gap-3 text-center">


          <p className="text-sm text-slate-500">
            Your portal access is secured through email verification.
          </p>


          <Link
            href="/auth/staff-login"
            className="font-medium text-slate-600 transition hover:text-[#1E88E5]"
          >
            Staff Login
          </Link>


        </div>



      </div>


    </div>
  )

}
