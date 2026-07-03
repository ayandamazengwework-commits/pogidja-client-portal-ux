import type { ReactNode } from "react"

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <main className="min-h-screen bg-[#f5f8fc]">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">

        {children}

      </div>
    </main>
  )
}
