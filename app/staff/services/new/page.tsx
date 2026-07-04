import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function NewServicePage() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            New Service
          </h1>

          <p className="text-slate-500">
            Create a new service for a client.
          </p>

        </div>

        <Link href="/staff/services">
          <Button variant="outline">
            Back to Services
          </Button>
        </Link>

      </div>

      <Card>

        <CardContent className="p-8">

          <form className="space-y-6">

            {/* Client */}

            <div className="space-y-2">

              <Label htmlFor="client">
                Client
              </Label>

              <Input
                id="client"
                placeholder="Client selection coming next..."
                disabled
              />

            </div>

            {/* Title */}

            <div className="space-y-2">

              <Label htmlFor="title">
                Service Title
              </Label>

              <Input
                id="title"
                placeholder="Annual Return"
              />

            </div>

            {/* Category */}

            <div className="space-y-2">

              <Label htmlFor="category">
                Service Category
              </Label>

              <Input
                id="category"
                placeholder="Tax Compliance"
              />

            </div>

            {/* Description */}

            <div className="space-y-2">

              <Label htmlFor="description">
                Description
              </Label>

              <Textarea
                id="description"
                rows={5}
                placeholder="Describe the work to be completed..."
              />

            </div>

            <div className="grid gap-6 md:grid-cols-3">

              {/* Priority */}

              <div className="space-y-2">

                <Label>
                  Priority
                </Label>

                <Input
                  placeholder="Normal"
                />

              </div>

              {/* Due Date */}

              <div className="space-y-2">

                <Label>
                  Due Date
                </Label>

                <Input
                  type="date"
                />

              </div>

              {/* Progress */}

              <div className="space-y-2">

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

            <div className="space-y-2">

              <Label>
                Assigned Staff
              </Label>

              <Input
                placeholder="Staff selection coming next..."
                disabled
              />

            </div>

            <div className="flex justify-end">

              <Button type="submit">
                Create Service
              </Button>

            </div>

          </form>

        </CardContent>

      </Card>

    </div>
  )
}
