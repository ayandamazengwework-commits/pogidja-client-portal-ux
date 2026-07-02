import type { ReactNode } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/brand/logo'
import { ShieldCheck, TrendingUp, FileCheck2 } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-slate-50 via-white to-emerald-50">

      {/* LEFT SIDE */}
      <div className="relative hidden overflow-hidden lg:flex">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F5132] via-[#145A32] to-[#1B4332]" />

        {/* Glow */}
        <div className="absolute -top-24 -left-20 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex w-full flex-col justify-between p-14 text-white">

          <div>

            <Link href="/">
              <Logo variant="light" />
            </Link>

            <div className="mt-20 max-w-xl">

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                Secure Client Portal
              </span>

              <h1 className="mt-6 text-5xl font-bold leading-tight">

                Manage your tax matters

                <span className="block text-emerald-300">
                  without the phone calls.
                </span>

              </h1>

              <p className="mt-6 text-lg leading-8 text-white/80">

                Welcome to the Pogidja Client Portal.

                Securely upload documents, monitor the progress of your
                services, receive updates and communicate with your
                accountant from anywhere.

              </p>

            </div>

          </div>

          {/* Feature Cards */}

          <div className="grid gap-4">

            {[
              {
                icon: FileText,
                title: "Track Services",
                text: "Follow the progress of your tax matters in real time.",
              },
              {
                icon: BellRing,
                title: "Receive Updates",
                text: "Automatic email notifications whenever your case changes.",
              },
              {
                icon: MessageSquare,
                title: "Secure Messaging",
                text: "Communicate with your accountant securely.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md"
              >
                <div className="flex items-start gap-4">

                  <div className="rounded-xl bg-white/15 p-3">

                    <item.icon className="h-6 w-6 text-emerald-300" />

                  </div>

                  <div>

                    <h3 className="font-semibold">

                      {item.title}

                    </h3>

                    <p className="mt-1 text-sm text-white/70">

                      {item.text}

                    </p>

                  </div>

                </div>
              </div>
            ))}

          </div>

          {/* Footer */}

          <div className="pt-8 text-sm text-white/60">

            <p>

              Registered Tax Practitioners • Chartered Accountants •
              Business Advisory

            </p>

            <p className="mt-2">

              © {new Date().getFullYear()} Pogidja Advisory Services

            </p>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="flex items-center justify-center bg-white px-6 py-10">

        <div className="w-full max-w-md">

          <div className="mb-10 lg:hidden">

            <Logo />

          </div>

          {children}

        </div>

      </div>

    </div>
  )
}
