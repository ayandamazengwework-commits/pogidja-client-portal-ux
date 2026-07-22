'use client'

import { useState } from 'react'

import { updateClientProfile } from '@/app/staff/clients/[id]/edit/actions'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function EditClientForm({
  client,
}: {
  client: any
}) {
  const [loading, setLoading] = useState(false)

  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="p-8">

        <form
          action={async (formData) => {
            setLoading(true)
            await updateClientProfile(formData)
          }}
          className="space-y-10"
        >

          <input
            type="hidden"
            name="client_id"
            value={client.id}
          />

          <input
            type="hidden"
            name="profile_id"
            value={client.profile.id}
          />

          {/* PERSONAL */}

          <section className="space-y-6">

            <div>
              <h2 className="text-xl font-bold">
                Personal Information
              </h2>

              <p className="text-sm text-slate-500">
                Update the client's information.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <Label>First Name</Label>
                <Input
                  name="first_name"
                  defaultValue={client.profile.first_name ?? ''}
                />
              </div>

              <div>
                <Label>Last Name</Label>
                <Input
                  name="last_name"
                  defaultValue={client.profile.last_name ?? ''}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={client.profile.email ?? ''}
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  defaultValue={client.profile.phone ?? ''}
                />
              </div>

              <div>
                <Label>ID Number</Label>
                <Input
                  name="id_number"
                  defaultValue={client.profile.id_number ?? ''}
                />
              </div>

            </div>

          </section>

          {/* COMPANY */}

          <section className="space-y-6">

            <div>
              <h2 className="text-xl font-bold">
                Company Details
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <Label>Company Name</Label>
                <Input
                  name="company_name"
                  defaultValue={client.profile.company_name ?? ''}
                />
              </div>

              <div>
                <Label>Registration Number</Label>
                <Input
                  name="company_registration"
                  defaultValue={client.profile.company_registration ?? ''}
                />
              </div>

              <div>
                <Label>VAT Number</Label>
                <Input
                  name="vat_number"
                  defaultValue={client.profile.vat_number ?? ''}
                />
              </div>

              <div>
                <Label>Income Tax Number</Label>
                <Input
                  name="tax_number"
                  defaultValue={client.profile.tax_number ?? ''}
                />
              </div>

            </div>

          </section>

          {/* ADDRESS */}

          <section className="space-y-6">

            <h2 className="text-xl font-bold">
              Address
            </h2>

            <Textarea
              rows={3}
              name="address"
              defaultValue={client.profile.address ?? ''}
            />

            <div className="grid gap-6 md:grid-cols-3">

              <div>
                <Label>City</Label>
                <Input
                  name="city"
                  defaultValue={client.profile.city ?? ''}
                />
              </div>

              <div>
                <Label>Province</Label>
                <Input
                  name="province"
                  defaultValue={client.profile.province ?? ''}
                />
              </div>

              <div>
                <Label>Postal Code</Label>
                <Input
                  name="postal_code"
                  defaultValue={client.profile.postal_code ?? ''}
                />
              </div>

            </div>

          </section>

          {/* STATUS */}

          <section className="space-y-6">

            <h2 className="text-xl font-bold">
              Client Status
            </h2>

            <select
              name="status"
              defaultValue={client.status}
              className="w-full rounded-xl border p-3"
            >
              <option value="Pending">
                Pending
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

              <option value="Archived">
                Archived
              </option>

            </select>

          </section>

          {/* NOTES */}

          <section className="space-y-6">

            <h2 className="text-xl font-bold">
              Internal Notes
            </h2>

            <Textarea
              rows={5}
              name="notes"
              defaultValue={client.profile.notes ?? ''}
            />

          </section>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full"
          >
            {loading
              ? 'Saving...'
              : 'Save Changes'}
          </Button>

        </form>

      </CardContent>
    </Card>
  )
}
