'use client'

import {
  useState,
} from 'react'

import {
  useRouter,
} from 'next/navigation'

import {
  Loader2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'


import {
  createClient,
} from '@/lib/supabase/client'


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


export default function VerifyPage() {

  const router = useRouter()

  const supabase =
    createClient()


  const [
    code,
    setCode,
  ] = useState('')


  const [
    loading,
    setLoading,
  ] = useState(false)


  const [
    error,
    setError,
  ] = useState<string | null>(null)



  async function verifyOTP(
    e: React.FormEvent
  ) {

    e.preventDefault()

    setLoading(true)
    setError(null)


    const email =
      sessionStorage.getItem(
        'pog_login_email'
      )


    if (!email) {

      setError(
        'Login session expired. Please try again.'
      )

      setLoading(false)

      return
    }



    const {
      error,
    } =
      await supabase.auth.verifyOtp({

        email,

        token: code,

        type: 'email',

      })



    if (error) {

      setError(
        error.message
      )

      setLoading(false)

      return

    }



    sessionStorage.removeItem(
      'pog_login_email'
    )


    router.push(
      '/portal'
    )

    router.refresh()

  }



  return (

    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-6">


      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">


        <div className="mb-6 flex flex-col items-center">


          <ShieldCheck
            className="h-14 w-14 text-[#1E88E5]"
          />


          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Verify your identity
          </h1>


          <p className="mt-2 text-center text-sm text-slate-600">
            We've sent a 6 digit verification code
            to your registered email address.
          </p>


        </div>



        {error && (

          <Alert
            variant="destructive"
            className="mb-5"
          >

            <AlertCircle
              className="h-4 w-4"
            />

            <AlertDescription>
              {error}
            </AlertDescription>


          </Alert>

        )}




        <form
          onSubmit={verifyOTP}
          className="space-y-5"
        >


          <Input

            value={code}

            onChange={(e) =>
              setCode(
                e.target.value
              )
            }

            placeholder="123456"

            maxLength={8}

            inputMode="numeric"

            className="h-16 text-center text-3xl tracking-[0.5em]"

            required

          />



          <Button

            disabled={loading}

            className="h-14 w-full rounded-xl bg-gradient-to-r from-[#2196F3] to-[#1565C0] text-lg"

          >

            {loading && (
              <Loader2
                className="mr-2 h-5 w-5 animate-spin"
              />
            )}


            Verify Code


          </Button>


        </form>


      </div>


    </div>

  )

}
