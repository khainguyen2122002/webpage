'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { GraduationCap, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const adminEmail = 'khainguyen2122002@gmail.com'

    if (email !== adminEmail) {
      setError('Chỉ tài khoản admin mới có quyền truy cập trang này.')
      setLoading(false)
      return
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
    } else {
      router.push('/admin')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-primary p-12 text-center text-white space-y-4">
          <div className="bg-secondary p-3 rounded-2xl w-fit mx-auto mb-4">
             <GraduationCap className="w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-bold">Quản Trị Viên</CardTitle>
          <CardDescription className="text-white/60">Vui lòng đăng nhập để quản lý trung tâm.</CardDescription>
        </div>
        <CardContent className="p-12 space-y-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Email</label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Mật khẩu</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl focus-visible:ring-primary"
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm font-medium bg-red-50 p-4 rounded-xl border border-red-100 italic">
                {error}
              </p>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg active:scale-95 transition-all"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Đăng nhập'}
            </Button>
          </form>
          
          <div className="text-center">
            <Link 
              href="/" 
              className={cn(buttonVariants({ variant: "link" }), "text-slate-400 hover:text-primary")}
            >
              Quay lại trang chủ
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
