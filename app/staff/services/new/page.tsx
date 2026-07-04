import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

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

      <Card>

        <CardContent className="p-8">

          <form className="space-y-6">

            {/* Client */}

            <div>

              <Label>
                Client
              </Label>

              <select
                className="mt-2 w-full rounded-md border p-3"
              >

                <option>
                  Select Client
                </option>

                {clients?.map((client) => (

                  <option
                    key={client.id}
                    value={client.id}
                  >

                    {client.company?.name ||

                      `${client.profile?.first_name} ${client.profile?.last_name}`}

                  </option>

                ))}

              </select>

            </div>

            {/* Title */}

            <div>

              <Label>
                Service Title
              </Label>

              <Input placeholder="Annual Return" />

            </div>

            {/* Category */}

            <div>

              <Label>
                Category
              </Label>

              <select
                className="mt-2 w-full rounded-md border p-3"
              >

                <option>
                  Select Category
                </option>

                {categories?.map((category) => (

                  <option
                    key={category.id}
                    value={category.id}
                  >

                    {category.name}

                  </option>

                ))}

              </select>

            </div>

            {/* Description */}

            <div>

              <Label>
                Description
              </Label>

              <Textarea
                rows={5}
              />

            </div>

            <div className="grid gap-6 md:grid-cols-3">

              <div>

                <Label>
                  Priority
                </Label>

                <select className="mt-2 w-full rounded-md border p-3">

                  <option>Low</option>

                  <option>Normal</option>

                  <option>High</option>

                  <option>Urgent</option>

                </select>

              </div>

              <div>

                <Label>
                  Due Date
                </Label>

                <Input type="date" />

              </div>

              <div>

                <Label>
                  Progress
                </Label>

                <Input
                  type="number"
                  defaultValue={0}
                />

              </div>

            </div>

            {/* Assigned Staff */}

            <div>

              <Label>
               Assign Staff
              </Label>

              <select
                className="mt-2 w-full rounded-md border p-3"
              >

                <option>
                  Unassigned
                </option>

                {staff?.map((person) => (

                  <option
                    key={person.id}
                    value={person.id}
                  >

                    {person.first_name} {person.last_name}

                  </option>

                ))}

              </select>

            </div>

            <div className="flex justify-end">

              <Button>
                Create Service
              </Button>

            </div>

          </form>

        </CardContent>

      </Card>

    </div>
  )
}
