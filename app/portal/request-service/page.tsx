import { createClient } from '@/lib/supabase/server'

import { NewRequestForm } from '@/components/portal/new-request-form'

export default async function RequestServicePage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('service_categories')
    .select('*')
    .order('name')

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Request a Service
        </h1>

        <p className="mt-2 text-slate-500">
          Tell us what you need help with and our team will begin reviewing your request.
        </p>
      </div>

      <NewRequestForm
        categories={categories ?? []}
      />

    </div>
  )
}
