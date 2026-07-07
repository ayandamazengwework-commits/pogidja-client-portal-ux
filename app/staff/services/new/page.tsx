import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

import { Button } from '@/components/ui/button'
import { NewServiceForm } from '@/components/services/new-service-form'

export default async function NewServicePage() {
  const supabase = await createClient()

  // Clients
  const { data: clients } = await supabase
    .from('clients')
    .select(`
      id,
      profile:profiles(
        first_name,
        last_name
      ),
      company:companies(
        name
      )
    `)
    .order('created_at')

  // Categories
  const { data: categories } = await supabase
    .from('service_categories')
    .select('*')
    .order('name')

  // Staff
  const { data: staff } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, role')
    .in('role', ['staff', 'manager', 'admin'])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            New Service
          </h1>

          <p className="text-slate-500">
            Create a new service.
          </p>
        </div>

        <Link href="/staff/services">
          <Button variant="outline">
            Back
          </Button>
        </Link>
      </div>

      <NewServiceForm
        clients={clients ?? []}
        categories={categories ?? []}
        staff={staff ?? []}
      />
    </div>
  )
}
