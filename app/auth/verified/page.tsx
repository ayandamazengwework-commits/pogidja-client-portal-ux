import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function VerifiedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">

      <Card className="w-full max-w-xl rounded-3xl shadow-xl">

        <CardContent className="space-y-8 p-10 text-center">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">

            <CheckCircle2 className="h-14 w-14 text-green-600" />

          </div>

          <div>

            <h1 className="text-4xl font-bold text-slate-900">
              Email Verified
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              Your account has been successfully verified.
            </p>

            <p className="mt-2 text-slate-500">
              Welcome to the secure client portal for
              <br />
              <strong>POG Advisory & Chartered Accountants Inc.</strong>
            </p>

          </div>

          <Button
            asChild
            size="lg"
            className="w-full"
          >
            <Link href="/auth/login">

              Continue to Login

              <ArrowRight className="ml-2 h-5 w-5" />

            </Link>
          </Button>

        </CardContent>

      </Card>

    </div>
  )
}
