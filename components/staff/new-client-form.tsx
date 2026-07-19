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
          className="space-y-10"
        >

          {/* PERSONAL DETAILS */}

          <section className="space-y-6">

            <div>
              <h2 className="text-xl font-bold">
                Personal Information
              </h2>

              <p className="text-sm text-slate-500">
                Basic client information.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <Label>First Name *</Label>
                <Input
                  name="first_name"
                  required
                />
              </div>

              <div>
                <Label>Last Name *</Label>
                <Input
                  name="last_name"
                  required
                />
              </div>

              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  name="email"
                  required
                />
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input
                  name="phone"
                />
              </div>

              <div>
                <Label>ID Number</Label>
                <Input
                  name="id_number"
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

              <p className="text-sm text-slate-500">
                Leave blank if the client is an individual.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <Label>Company Name</Label>
                <Input
                  name="company_name"
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
                <Label>Income Tax Number</Label>
                <Input
                  name="tax_number"
                />
              </div>

            </div>

          </section>

          {/* ADDRESS */}

          <section className="space-y-6">

            <div>
              <h2 className="text-xl font-bold">
                Address
              </h2>
            </div>

            <Textarea
              rows={3}
              name="address"
            />

            <div className="grid gap-6 md:grid-cols-3">

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

          </section>

          {/* FIRST REQUEST */}

          <section className="space-y-6">

            <div>
              <h2 className="text-xl font-bold">
                First Request
              </h2>

              <p className="text-sm text-slate-500">
                What is the client approaching POG Advisory for?
              </p>
            </div>

            <Textarea
              rows={5}
              name="notes"
              placeholder="Example: Register VAT, Company Annual Returns, Payroll, Tax Clearance..."
            />

          </section>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full text-base"
          >
            {loading
              ? 'Creating Client...'
              : 'Create Client'}
          </Button>

        </form>

      </CardContent>
    </Card>
  )
}
