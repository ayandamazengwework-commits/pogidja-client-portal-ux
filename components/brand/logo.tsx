import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'default' | 'light'
  showText?: boolean
}

export function Logo({
  className,
  variant = 'default',
  showText = true,
}: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-primary'
  const subColor =
    variant === 'light' ? 'text-white/60' : 'text-muted-foreground'

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
        <span className="font-serif text-lg font-bold tracking-tight">POG</span>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn('font-serif text-base font-bold', textColor)}>
            POG Advisory
          </span>
          <span className={cn('text-[11px] font-medium tracking-wide', subColor)}>
            Chartered Accountants
          </span>
        </div>
      )}
    </div>
  )
}
