import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusStyles: Record<
  string,
  {
    label: string
    className: string
  }
> = {
  Submitted: {
    label: 'Submitted',
    className:
      'bg-blue-100 text-blue-700 border border-blue-200',
  },

  'In Review': {
    label: 'In Review',
    className:
      'bg-amber-100 text-amber-700 border border-amber-200',
  },

  'Awaiting Client': {
    label: 'Awaiting Client',
    className:
      'bg-orange-100 text-orange-700 border border-orange-200',
  },

  'Working On It': {
    label: 'Working On It',
    className:
      'bg-purple-100 text-purple-700 border border-purple-200',
  },

  Completed: {
    label: 'Completed',
    className:
      'bg-green-100 text-green-700 border border-green-200',
  },
}

export function StatusBadge({
  status,
  className,
}: StatusBadgeProps) {
  const badge =
    statusStyles[status] ?? {
      label: status,
      className:
        'bg-slate-100 text-slate-700 border border-slate-200',
    }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        badge.className,
        className
      )}
    >
      {badge.label}
    </span>
  )
}
