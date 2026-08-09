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
  const isLight = variant === 'light'

  const textColor = isLight
    ? 'text-white'
    : 'text-[#17365D]'

  const subColor = isLight
    ? 'text-white/65'
    : 'text-slate-500'

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        className
      )}
    >
      {/* ===================================================== */}
      {/* LOGO MARK                                               */}
      {/* ===================================================== */}

      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm',
          isLight
            ? 'bg-white text-[#17365D]'
            : 'bg-[#17365D] text-white'
        )}
      >
        <span className="font-serif text-xl font-bold leading-none">
          P
        </span>
      </div>

      {/* ===================================================== */}
      {/* COMPANY NAME                                           */}
      {/* ===================================================== */}

      {showText && (
        <div className="flex min-w-0 flex-col justify-center leading-none">
          <span
            className={cn(
              'font-serif text-[13px] font-bold leading-tight tracking-[0.02em]',
              textColor
            )}
          >
            POG ADVISORY
          </span>

          <span
            className={cn(
              'mt-1 max-w-[175px] text-[8px] font-semibold uppercase leading-[1.25] tracking-[0.06em]',
              subColor
            )}
          >
            AND CHARTERED ACCOUNTANTS INC.
          </span>
        </div>
      )}
    </div>
  )
}
