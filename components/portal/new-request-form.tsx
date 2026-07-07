'use client'

import { useState } from 'react'

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
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  return (
    <div className="space-y-8">

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

      {/* Request Details */}

      <div className="space-y-6 rounded-2xl border bg-white p-8">

        <div>
          <Label>
            Request Title
          </Label>

          <Input
            placeholder="Example: Annual Financial Statements"
          />
        </div>

        <div>
          <Label>
            Tell us about your request
          </Label>

          <Textarea
            rows={6}
            placeholder="Describe what you need help with..."
          />
        </div>

        <div className="flex justify-end">
          <Button disabled={!selectedCategory}>
            Submit Request
          </Button>
        </div>

      </div>

    </div>
  )
}
