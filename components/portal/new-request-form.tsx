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
        <h2 className="mb-4 text-2xl font-semibold">
          Choose a Service
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-2xl border p-6 text-left transition ${
                selectedCategory === category.id
                  ? 'border-[#1E88E5] bg-blue-50'
                  : 'hover:border-slate-300'
              }`}
            >
              <h3 className="font-semibold">
                {category.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Select this service
              </p>
            </button>
          ))}
        </div>
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
