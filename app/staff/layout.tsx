import type { ReactNode } from "react";

export default function StaffLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="flex w-72 flex-col border-r border-slate-200 bg-white">

  {/* Logo */}
  <div className="border-b border-slate-200 p-8">

    <h1 className="text-2xl font-bold tracking-tight">
      POG
      <span className="text-[#1E88E5]"> Advisory</span>
    </h1>

    <p className="mt-1 text-sm text-slate-500">
      Workspace
    </p>

  </div>

  {/* Navigation */}

  <nav className="flex-1 space-y-2 p-4">

    <div className="rounded-xl bg-[#1E88E5] px-4 py-3 font-medium text-white">
      Dashboard
    </div>

    <div className="rounded-xl px-4 py-3 text-slate-700 transition hover:bg-slate-100">
      Clients
    </div>

    <div className="rounded-xl px-4 py-3 text-slate-700 transition hover:bg-slate-100">
      Services
    </div>

    <div className="rounded-xl px-4 py-3 text-slate-700 transition hover:bg-slate-100">
      Documents
    </div>

    <div className="rounded-xl px-4 py-3 text-slate-700 transition hover:bg-slate-100">
      Messages
    </div>

    <div className="rounded-xl px-4 py-3 text-slate-700 transition hover:bg-slate-100">
      Reports
    </div>

    <div className="rounded-xl px-4 py-3 text-slate-700 transition hover:bg-slate-100">
      Calendar
    </div>

    <div className="rounded-xl px-4 py-3 text-slate-700 transition hover:bg-slate-100">
      Settings
    </div>

  </nav>

  {/* Bottom */}

  <div className="border-t border-slate-200 p-5">

    <div className="rounded-xl bg-slate-50 p-4">

      <p className="font-semibold">
        Workspace
      </p>

      <p className="text-sm text-slate-500">
        Logged in
      </p>

    </div>

  </div>

</aside>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
