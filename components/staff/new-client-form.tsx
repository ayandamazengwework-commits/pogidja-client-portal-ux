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
          {/* CLIENT */}

          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">
                Client Information
              </h2>

              <p className="text-sm text-slate-500">
                Personal details for the new client.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label>First Name *</Label>
                <Input name="first_name" required />
              </div>

              <div>
                <Label>Last Name *</Label>
                <Input name="last_name" required />
              </div>

              <div>
                <Label>Email *</Label>
                <Input
                  name="email"
                  type="email"
                  required
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input name="phone" />
              </div>

              <div>
                <Label>ID Number</Label>
                <Input name="id_number" />
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
                <Input name="company_name" />
              </div>

              <div>
                <Label>Company Registration</Label>
                <Input name="company_registration" />
              </div>

              <div>
                <Label>VAT Number</Label>
                <Input name="vat_number" />
              </div>

              <div>
                <Label>Income Tax Number</Label>
                <Input name="tax_number" />
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
            />

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <Label>City</Label>
                <Input name="city" />
              </div>

              <div>
                <Label>Province</Label>
                <Input name="province" />
              </div>

              <div>
                <Label>Postal Code</Label>
                <Input name="postal_code" />
              </div>
            </div>
          </section>

          {/* SERVICE */}

          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">
                First Service
              </h2>

              <p className="text-sm text-slate-500">
                This becomes the client's first case.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label>Service Title *</Label>
                <Input
                  name="service_title"
                  placeholder="Annual Returns"
                  required
                />
              </div>

              <div>
                <Label>Service Type *</Label>
                <Input
                  name="service_type"
                  placeholder="Company Compliance"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                rows={4}
                name="service_description"
                placeholder="Describe the work to be completed..."
              />
            </div>
          </section>

          {/* DOCUMENT REQUESTS */}

          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">
                Initial Document Request
              </h2>

              <p className="text-sm text-slate-500">
                One document per line.
              </p>
            </div>

            <Textarea
              rows={8}
              name="document_requests"
              placeholder={`Certified ID Copy
Proof of Address
Company Registration Certificate
VAT Certificate
Income Tax Number`}
            />
          </section>

          {/* NOTES */}

          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">
                Internal Staff Notes
              </h2>
            </div>

            <Textarea
              rows={4}
              name="notes"
              placeholder="Visible to staff only."
            />
          </section>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full text-base"
          >
            {loading
              ? 'Creating Client...'
              : 'Create Client & Send Invitation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
