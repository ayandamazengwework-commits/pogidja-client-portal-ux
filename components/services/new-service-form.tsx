'use client'

import { useFormStatus } from 'react-dom'

import { createService } from '@/app/staff/services/new/actions'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Client {
  id: string
  profile: {
    first_name: string | null
    last_name: string | null
    company_name?: string | null
    email?: string | null
  } | null
}

interface Category {
  id: string
  name: string
}

interface StaffMember {
  id: string
  first_name: string
  last_name: string
  role: string
}

interface Props {
  clients: Client[]
  categories: Category[]
  staff: StaffMember[]
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
    >
      {pending ? 'Creating Service...' : 'Create Service'}
    </Button>
  )
}

export function NewServiceForm({
  clients,
  categories,
  staff,
}: Props) {
  return (
    <Card>

      <CardContent className="p-8">

        <form
          action={createService}
          className="space-y-6"
        >

          {/* CLIENT */}

          <div>

            <Label htmlFor="client_id">
              Client
            </Label>

            <select
              id="client_id"
              name="client_id"
              required
              className="mt-2 w-full rounded-md border p-3"
            >

              <option value="">
                Select Client
              </option>

              {clients.map((client) => {

                const displayName =
                  client.profile?.company_name?.trim()
                    ? client.profile.company_name
                    : `${client.profile?.first_name ?? ''} ${client.profile?.last_name ?? ''}`

                return (
                  <option
                    key={client.id}
                    value={client.id}
                  >
                    {displayName}
                  </option>
                )
              })}

            </select>

          </div>

          {/* TITLE */}

          <div>

            <Label htmlFor="title">
              Service Title
            </Label>

            <Input
              id="title"
              name="title"
              required
              placeholder="Annual Financial Statements"
            />

          </div>

          {/* CATEGORY */}

          <div>

            <Label htmlFor="service_category_id">
              Category
            </Label>

            <select
              id="service_category_id"
              name="service_category_id"
              required
              className="mt-2 w-full rounded-md border p-3"
            >

              <option value="">
                Select Category
              </option>

              {categories.map((category) => (

                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>

              ))}

            </select>

          </div>

          {/* DESCRIPTION */}

          <div>

            <Label htmlFor="description">
              Description
            </Label>

            <Textarea
              id="description"
              name="description"
              rows={5}
            />

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <div>

              <Label htmlFor="priority">
                Priority
              </Label>

              <select
                id="priority"
                name="priority"
                defaultValue="Normal"
                className="mt-2 w-full rounded-md border p-3"
              >
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
                <option>Urgent</option>
              </select>

            </div>

            <div>

              <Label htmlFor="due_date">
                Due Date
              </Label>

              <Input
                id="due_date"
                name="due_date"
                type="date"
              />

            </div>

            <div>

              <Label htmlFor="progress">
                Progress
              </Label>

              <Input
                id="progress"
                name="progress"
                type="number"
                min={0}
                max={100}
                defaultValue={0}
              />

            </div>

          </div>

          {/* STAFF */}

          <div>

            <Label htmlFor="assigned_to">
              Assign Staff
            </Label>

            <select
              id="assigned_to"
              name="assigned_to"
              className="mt-2 w-full rounded-md border p-3"
            >

              <option value="">
                Unassigned
              </option>

              {staff.map((person) => (

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

            <SubmitButton />

          </div>

        </form>

      </CardContent>

    </Card>
  )
}
