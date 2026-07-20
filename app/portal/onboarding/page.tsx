import { redirect } from 'next/navigation'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: requests } = await supabase
    .from('document_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at')

  const completed =
    requests?.filter((r) => r.completed).length ?? 0

  const total = requests?.length ?? 0

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-10">

      <div>

        <h1 className="text-4xl font-bold">
          Complete Your Onboarding
        </h1>

        <p className="mt-3 text-slate-600">
          Before accessing your client portal,
          please upload the requested documents
          below.
        </p>

      </div>

      <Card className="rounded-3xl">

        <CardContent className="space-y-6 p-8">

          <div>

            <div className="mb-2 flex justify-between">

              <span className="font-medium">
                Progress
              </span>

              <span>
                {completed} / {total}
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full bg-blue-600 transition-all"
                style={{
                  width:
                    total === 0
                      ? '100%'
                      : `${(completed / total) * 100}%`,
                }}
              />

            </div>

          </div>

          {requests?.length ? (

            <div className="space-y-4">

              {requests.map((request) => (

                <div
                  key={request.id}
                  className="flex items-center justify-between rounded-2xl border p-5"
                >

                  <div>

                    <h3 className="font-semibold">
                      {request.title}
                    </h3>

                    {request.description && (
                      <p className="mt-1 text-sm text-slate-500">
                        {request.description}
                      </p>
                    )}

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      request.completed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {request.completed
                      ? 'Completed'
                      : 'Pending'}
                  </span>

                </div>

              ))}

            </div>

          ) : (

            <div className="rounded-2xl border border-dashed p-8 text-center">

              <h2 className="text-xl font-semibold">
                No outstanding requests
              </h2>

              <p className="mt-3 text-slate-500">
                Your onboarding has been completed.
              </p>

            </div>

          )}

          <Button
            asChild
            className="w-full"
          >

            <Link href="/portal/documents">
              Upload Documents
            </Link>

          </Button>

          {completed === total && total > 0 && (

            <Button
              asChild
              variant="outline"
              className="w-full"
            >

              <Link href="/portal">
                Continue to Portal
              </Link>

            </Button>

          )}

        </CardContent>

      </Card>

    </div>
  )
}
