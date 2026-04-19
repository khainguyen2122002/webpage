'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  School, 
  BookOpen, 
  Settings, 
  LogOut,
  ChevronLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/center', label: 'Thông tin trung tâm', icon: School },
    { href: '/admin/courses', label: 'Quản lý khóa học', icon: BookOpen },
    { href: '/admin/settings', label: 'Cài đặt', icon: Settings },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="w-64 bg-primary text-white h-screen fixed left-0 top-0 flex flex-col z-50">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-secondary">
          ADMIN PANEL
        </Link>
      </div>

      <nav className="flex-grow p-4 space-y-2 mt-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium group",
              pathname === link.href 
                ? "bg-secondary text-white shadow-lg shadow-secondary/20" 
                : "hover:bg-white/10 text-white/70 hover:text-white"
            )}
          >
            <link.icon className={cn(
              "w-5 h-5",
              pathname === link.href ? "text-white" : "text-secondary"
            )} />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 gap-3 px-4 py-6 rounded-xl"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 text-secondary" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
