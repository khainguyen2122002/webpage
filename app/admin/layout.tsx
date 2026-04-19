import { AdminSidebar } from '@/components/admin-sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-grow pl-64">
        <header className="h-16 border-b bg-white flex items-center px-8 shadow-sm">
          <h2 className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Quản trị hệ thống</h2>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
