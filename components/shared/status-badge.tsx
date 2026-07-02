import { cn } from "@/lib/utils"

type StatusBadgeProps = {
  label: string
  tone: string
  className?: string
}

export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        tone,
        className
      )}
    >
      {label}
    </span>
  )
}
