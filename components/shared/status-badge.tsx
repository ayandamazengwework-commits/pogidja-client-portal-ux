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
      'border border-blue-200 bg-blue-100 text-blue-700',
  },

  'In Review': {
    label: 'In Review',
    className:
      'border border-amber-200 bg-amber-100 text-amber-700',
  },

  'Awaiting Response': {
    label: 'Awaiting Response',
    className:
      'border border-orange-200 bg-orange-100 text-orange-700',
  },

  'Awaiting Client': {
    label: 'Awaiting Client',
    className:
      'border border-orange-200 bg-orange-100 text-orange-700',
  },

  'Awaiting Documents': {
    label: 'Awaiting Documents',
    className:
      'border border-orange-200 bg-orange-100 text-orange-700',
  },

  'Working On It': {
    label: 'Working On It',
    className:
      'border border-purple-200 bg-purple-100 text-purple-700',
  },

  Completed: {
    label: 'Completed',
    className:
      'border border-green-200 bg-green-100 text-green-700',
  },

  Cancelled: {
    label: 'Cancelled',
    className:
      'border border-red-200 bg-red-100 text-red-700',
  },
}

export function StatusBadge({
  status,
  className,
}: StatusBadgeProps) {
  const badge =
    statusStyles[status] ?? {
      label: status || 'Unknown',
      className:
        'border border-slate-200 bg-slate-100 text-slate-700',
    }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap',
        badge.className,
        className
      )}
    >
      {badge.label}
    </span>
  )
}
