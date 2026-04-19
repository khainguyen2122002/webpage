'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, GraduationCap } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [centerName, setCenterName] = useState('INSPIRING HR')
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    
    // Fetch data
    const fetchData = async () => {
      // User
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // Center Name
      const { data: center } = await supabase.from('center_info').select('name').single()
      if (center) setCenterName(center.name.toUpperCase())
    }
    fetchData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Realtime for center name
    const channel = supabase.channel('nav-center').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'center_info' }, (payload) => {
        if (payload.new.name) setCenterName(payload.new.name.toUpperCase())
    }).subscribe()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      subscription.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [])

  const adminEmail = 'khainguyen2122002@gmail.com'
  const isAdmin = user?.email === adminEmail

  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/courses', label: 'Khóa học' },
    { href: '/about', label: 'Giới thiệu' },
    { href: '/contact', label: 'Liên hệ' },
  ]

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b py-2'
          : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <GraduationCap className="text-secondary w-6 h-6" />
          </div>
          <span className={cn(
            "font-bold text-xl tracking-tight",
            isScrolled ? "text-foreground" : "text-primary"
          )}>
            {centerName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:text-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin ? (
            <Link 
              href="/admin"
              className={cn(buttonVariants({ }), "bg-primary hover:bg-primary/90 text-white")}
            >
              Quản lý
            </Link>
          ) : !user ? (
            <Link 
              href="/login"
              className={cn(buttonVariants({ variant: "outline" }), "border-primary text-primary hover:bg-primary/5")}
            >
              Đăng nhập
            </Link>
          ) : null}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b absolute top-full left-0 w-full p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin ? (
            <Link 
              href="/admin" 
              className={cn(buttonVariants({ }), "w-full")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Quản lý
            </Link>
          ) : !user ? (
            <Link 
              href="/login" 
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Đăng nhập
            </Link>
          ) : null}
        </div>
      )}
    </nav>
  )
}
