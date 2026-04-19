import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Clock, TrendingUp, Award, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

import { SeedDataButton } from '@/components/admin/seed-data-button'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch real count from Supabase
  const { count: courseCount } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })

  // Fetch real count of contacts
  const { count: contactCount } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })

  const stats = [
    { label: 'Yêu cầu mới', value: (contactCount || 0).toString(), icon: Users, trend: 'New', color: 'text-blue-600' },
    { label: 'Khóa học active', value: (courseCount || 0).toString(), icon: BookOpen, trend: '+2', color: 'text-green-600' },
    { label: 'Tỷ lệ phản hồi', value: '100%', icon: CheckCircle2, trend: '+5%', color: 'text-amber-600' },
    { label: 'Cộng đồng HR', value: '1,2k', icon: Award, trend: '+18', color: 'text-purple-600' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Tổng quan Dashboard</h1>
          <p className="text-slate-500">Chào mừng bạn quay lại hệ thống quản trị Inspiring HR.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className={cn("p-3 rounded-xl bg-slate-50 transition-colors group-hover:bg-white", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" /> {stat.trend}
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden bg-primary text-white p-8 relative">
           <div className="relative z-10 space-y-4">
              <h2 className="text-2xl font-bold">Nâng tầm quản trị nhân sự</h2>
              <p className="text-white/70 max-w-md">Sử dụng hệ thống để quản lý các yêu cầu tư vấn và cập nhật lộ trình khóa học mẫu Inspiring HR của bạn thường xuyên.</p>
           </div>
           <div className="absolute top-0 right-0 w-64 h-full bg-secondary/10 -skew-x-12 translate-x-20" />
        </Card>
        
        <SeedDataButton />
      </div>
    </div>
  )
}
