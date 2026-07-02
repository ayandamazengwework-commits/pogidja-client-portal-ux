import type { ReactNode } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/brand/logo'
import { ShieldCheck, TrendingUp, FileCheck2 } from 'lucide-react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <Link href="/">
          <Logo variant="light" />
        </Link>

        <div className="max-w-md space-y-6">
          <h1 className="text-balance font-serif text-4xl font-bold leading-tight text-white">
            Your financial partner, always within reach.
          </h1>
          <p className="text-pretty leading-relaxed text-white/70">
            Securely track your engagements, share documents and stay on top of
            your compliance obligations — all in one place, built for South
            African businesses.
          </p>
          <ul className="space-y-4 pt-4">
            {[
              {
                icon: ShieldCheck,
                text: 'Bank-grade security & confidentiality',
              },
              { icon: FileCheck2, text: 'Real-time case & document tracking' },
              { icon: TrendingUp, text: 'SAICA-registered chartered expertise' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/90">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/50">
          &copy; {new Date().getFullYear()} POG Advisory &amp; Chartered
          Accountants. Gauteng &amp; Limpopo, South Africa.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
