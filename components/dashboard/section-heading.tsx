interface SectionHeadingProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function SectionHeading({
  title,
  description,
  action,
}: SectionHeadingProps) {
  return (
    <div className="mb-6 flex items-end justify-between">

      <div>

        <h2 className="text-2xl font-bold tracking-tight">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-muted-foreground">
            {description}
          </p>
        )}

      </div>

      {action}

    </div>
  )
}
