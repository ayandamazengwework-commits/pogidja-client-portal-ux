'use client'

import { useState } from 'react'

import { createClientProfile } from '@/app/staff/clients/new/actions'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function NewClientForm() {
  const [loading, setLoading] = useState(false)

  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="p-8">

        <form
          action={async (formData) => {
            setLoading(true)
            await createClientProfile(formData)
          }}
          className="space-y-8"
        >

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <Label>First Name</Label>
              <Input
                name="first_name"
                required
              />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                name="last_name"
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                required
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                name="phone"
              />
            </div>

            <div>
              <Label>Company</Label>
              <Input
                name="company_name"
              />
            </div>

            <div>
              <Label>ID Number</Label>
              <Input
                name="id_number"
              />
            </div>

            <div>
              <Label>Company Registration</Label>
              <Input
                name="company_registration"
              />
            </div>

            <div>
              <Label>VAT Number</Label>
              <Input
                name="vat_number"
              />
            </div>

            <div>
              <Label>Tax Number</Label>
              <Input
                name="tax_number"
              />
            </div>

            <div>
              <Label>City</Label>
              <Input
                name="city"
              />
            </div>

            <div>
              <Label>Province</Label>
              <Input
                name="province"
              />
            </div>

            <div>
              <Label>Postal Code</Label>
              <Input
                name="postal_code"
              />
            </div>

          </div>

          <div>
            <Label>Address</Label>
            <Textarea
              rows={4}
              name="address"
            />
          </div>

          <div>
            <Label>Internal Notes</Label>
            <Textarea
              rows={5}
              name="notes"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12"
          >
            {loading ? 'Creating Client...' : 'Create Client'}
          </Button>

        </form>

      </CardContent>
    </Card>
  )
}
