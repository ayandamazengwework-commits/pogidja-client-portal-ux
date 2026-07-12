'use client'

import { useState } from 'react'

import { createRequest } from '@/app/portal/request-service/actions'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Category {
  id: string
  name: string
}

interface Props {
  categories: Category[]
}

export function NewRequestForm({
  categories,
}: Props) {
  const [selectedCategory, setSelectedCategory] =
    useState('')

  return (
    <form
      action={createRequest}
      className="space-y-8"
      encType="multipart/form-data"
    >
      <input
        type="hidden"
        name="categoryId"
        value={selectedCategory}
      />

      {/* Service Selection */}
<div>
  <Label htmlFor="service">
    Service
  </Label>

  <select
    id="service"
    className="mt-2 h-12 w-full rounded-xl border bg-white px-4"
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
  >
    <option value="">
      Select a service...
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

      {/* Details */}

      <div className="space-y-6 rounded-2xl border bg-white p-8">

        <div>
          <Label htmlFor="title">
            Request Title
          </Label>

          <Input
            id="title"
            name="title"
            required
            placeholder="Example: Annual Financial Statements"
          />
        </div>

        <div>
          <Label htmlFor="description">
            Description
          </Label>

          <Textarea
            id="description"
            name="description"
            rows={6}
            required
            placeholder="Describe what you need help with..."
          />
        </div>

        {/* Documents */}

        <div>
          <Label htmlFor="documents">
            Supporting Documents
          </Label>

          <Input
            id="documents"
            name="documents"
            type="file"
            multiple
            className="mt-2"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          />

          <p className="mt-2 text-sm text-slate-500">
            Upload any supporting documents required for your request.
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!selectedCategory}
          >
            Submit Request
          </Button>
        </div>

      </div>
    </form>
  )
}
