import { cn } from '@/lib/utils'

export function StatusBadge({
  label,
  tone,
  className,
}: {
  label: string
  tone: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        tone,
        className,
      )}
    >
      {label}
    </span>
  )
}
