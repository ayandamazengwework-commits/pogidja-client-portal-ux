import Link from 'next/link'
import {
  ArrowLeft,
  Briefcase,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { NewServiceForm } from '@/components/services/new-service-form'

export default async function NewServicePage() {
  const supabase = await createClient()


  // Clients
  const {
    data: clients,
    error: clientsError,
  } = await supabase
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


  if (clientsError) {
    console.error(
      'CLIENTS QUERY ERROR:',
      clientsError
    )
  }


  // Categories
  const {
    data: categories,
    error: categoriesError,
  } = await supabase
    .from('service_categories')
    .select('*')
    .order('name')


  if (categoriesError) {
    console.error(
      'CATEGORIES QUERY ERROR:',
      categoriesError
    )
  }


  // Staff
 const staff = []


  if (staffError) {
    console.error(
      'STAFF QUERY ERROR:',
      staffError
    )
  }


  return (
    <div className="space-y-8">


      {/* Hero */}

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-6 text-white shadow-xl md:p-10">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">


          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
              SERVICE MANAGEMENT
            </p>


            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              Create New Service
            </h1>


            <p className="mt-4 max-w-2xl text-slate-300">
              Create a new service request,
              assign staff members and begin
              tracking progress immediately.
            </p>


          </div>


          <Card className="border-0 bg-white/10 backdrop-blur">

            <CardContent className="p-6 text-center">

              <Briefcase className="mx-auto mb-3 h-10 w-10 text-blue-200" />


              <p className="text-sm text-slate-300">
                Available Categories
              </p>


              <p className="mt-2 text-4xl font-bold">
                {categories?.length ?? 0}
              </p>


            </CardContent>

          </Card>


        </div>

      </section>



      <div className="flex justify-start">

        <Button
          variant="outline"
          asChild
        >

          <Link href="/staff/services">

            <ArrowLeft className="mr-2 h-4 w-4" />

            Back to Services

          </Link>

        </Button>


      </div>



      <Card className="rounded-3xl border-0 shadow-sm">

        <CardContent className="p-8">

          <NewServiceForm
            clients={clients ?? []}
            categories={categories ?? []}
            staff={staff ?? []}
          />


        </CardContent>


      </Card>


    </div>
  )
}
