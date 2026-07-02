import type { ReactNode } from "react"
import Link from "next/link"
import { Logo } from "@/components/brand/logo"
import { ShieldCheck, TrendingUp, FileCheck2 } from "lucide-react"

const features = [
  {
    icon: FileCheck2,
    title: "Track Your Services",
    description:
      "Monitor the progress of your tax returns, registrations and compliance requests in real time.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Document Sharing",
    description:
      "Upload and receive sensitive documents securely using encrypted cloud storage.",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Updates",
    description:
      "Receive instant notifications whenever your accountant updates your case.",
  },
]

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-slate-50">
      {/* Left Branding Panel */}
      <div className="relative hidden overflow-hidden lg:flex">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C5C3C] via-[#0A4F35] to-[#063624]" />

        {/* Decorative Blur */}
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-14 text-white">
          <div>
            <Link href="/">
              <Logo variant="light" />
            </Link>

            <div className="mt-20 max-w-xl">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
                Secure Client Portal
              </span>

              <h1 className="mt-8 text-5xl font-bold leading-tight">
                Manage your tax matters
                <span className="mt-2 block text-emerald-300">
                  without the phone calls.
                </span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-white/80">
                Welcome to the Pogidja Client Portal.
                <br />
                Securely upload documents, monitor the progress of your
                accounting and tax services, receive live updates and communicate
                with your accountant from anywhere.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/15"
                >
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                      <Icon className="h-6 w-6 text-emerald-300" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        {feature.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-white/70">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="space-y-2 border-t border-white/10 pt-8 text-sm text-white/60">
            <p>
              Registered Tax Practitioners • Chartered Accountants • Business
              Advisory
            </p>

            <p>Johannesburg • Limpopo • South Africa</p>

            <p>© {new Date().getFullYear()} Pogidja Advisory Services</p>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
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
