'use client'

import { useState } from 'react'

import { updateClientProfile } from '@/app/staff/clients/actions'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  client: any
  profile: any
}

export function EditClientForm({
  client,
  profile,
}: Props) {
  const [loading, setLoading] = useState(false)

  return (
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
        value={profile.id}
      />

      {/* PERSONAL */}

      <section className="space-y-6">

        <h2 className="text-xl font-bold">
          Personal Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <Label>First Name</Label>
            <Input
              name="first_name"
              defaultValue={profile.first_name ?? ''}
            />
          </div>

          <div>
            <Label>Last Name</Label>
            <Input
              name="last_name"
              defaultValue={profile.last_name ?? ''}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              defaultValue={profile.email ?? ''}
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              name="phone"
              defaultValue={profile.phone ?? ''}
            />
          </div>

          <div>
            <Label>ID Number</Label>
            <Input
              name="id_number"
              defaultValue={profile.id_number ?? ''}
            />
          </div>

        </div>

      </section>

      {/* COMPANY */}

      <section className="space-y-6">

        <h2 className="text-xl font-bold">
          Company Details
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <Label>Company Name</Label>
            <Input
              name="company_name"
              defaultValue={profile.company_name ?? ''}
            />
          </div>

          <div>
            <Label>Company Registration</Label>
            <Input
              name="company_registration"
              defaultValue={profile.company_registration ?? ''}
            />
          </div>

          <div>
            <Label>VAT Number</Label>
            <Input
              name="vat_number"
              defaultValue={profile.vat_number ?? ''}
            />
          </div>

          <div>
            <Label>Tax Number</Label>
            <Input
              name="tax_number"
              defaultValue={profile.tax_number ?? ''}
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
          defaultValue={profile.address ?? ''}
        />

        <div className="grid gap-6 md:grid-cols-3">

          <Input
            name="city"
            placeholder="City"
            defaultValue={profile.city ?? ''}
          />

          <Input
            name="province"
            placeholder="Province"
            defaultValue={profile.province ?? ''}
          />

          <Input
            name="postal_code"
            placeholder="Postal Code"
            defaultValue={profile.postal_code ?? ''}
          />

        </div>

      </section>

      {/* NOTES */}

      <section className="space-y-6">

        <h2 className="text-xl font-bold">
          Notes
        </h2>

        <Textarea
          rows={5}
          name="notes"
          defaultValue={profile.notes ?? ''}
        />

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

      <Button
        className="w-full"
        disabled={loading}
      >
        {loading
          ? 'Saving...'
          : 'Save Changes'}
      </Button>
    </form>
  )
}
