import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function VerifiedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">

      <Card className="w-full max-w-xl rounded-3xl border-slate-200 shadow-xl">

        <CardContent className="space-y-8 p-8 text-center sm:p-10">

          {/* SUCCESS ICON */}

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-14 w-14 text-green-600" />
          </div>

          {/* MESSAGE */}

          <div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Email Verified
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              Your account has been successfully verified.
            </p>

            <p className="mt-3 text-slate-500">
              Welcome to the secure client portal for
              <br />

              <strong className="text-slate-700">
                POG ADVISORY AND CHARTERED ACCOUNTANTS INC.
              </strong>
            </p>

          </div>

          {/* LOGIN BUTTON */}

          <Button
            asChild
            size="lg"
            className="w-full bg-[#1E88E5] hover:bg-[#1976D2]"
          >
            <Link href="/auth/login">
              Continue to Login

              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          {/* FOOTER */}

          <p className="text-xs leading-relaxed text-slate-400">
            Your account is now ready to use.
            <br />
            Please sign in to access your secure client portal.
          </p>

        </CardContent>

      </Card>

    </div>
  )
}
