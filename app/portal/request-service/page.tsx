import { createClient } from '@/lib/supabase/server'
import { NewRequestForm } from '@/components/portal/new-request-form'

export default async function RequestServicePage() {
  const supabase = await createClient()

  const { data: categories, error } = await supabase
    .from('service_categories')
    .select('*')
    .eq('is_active', true)
    .order('name')

  console.log(categories)
  console.log(error)

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <pre>{JSON.stringify(categories, null, 2)}</pre>

      <NewRequestForm
        categories={categories ?? []}
      />
    </div>
  )
}
