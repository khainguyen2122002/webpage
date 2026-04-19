'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, BookOpen, Clock, Users, ArrowRight, Layers, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { Course } from '@/types'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchCourses() {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setCourses(data as Course[])
        setFilteredCourses(data as Course[])
      }
      setLoading(false)
    }
    fetchCourses()

    // Realtime sync
    const channel = supabase
      .channel('public-courses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, (payload) => {
        fetchCourses()
        router.refresh()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    let result = courses
    
    if (search) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (levelFilter !== 'all') {
      result = result.filter(c => c.level === levelFilter)
    }
    
    setFilteredCourses(result)
  }, [search, levelFilter, courses])

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-6">
          <Badge className="bg-primary/5 text-primary border-none px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 w-fit">
            <Sparkles className="w-4 h-4" /> Khóa học đa dạng 📚
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-primary tracking-tight">
            Chương Trình <br />
            <span className="text-secondary italic">Đào Tạo</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed font-medium">
            Lựa chọn khóa học phù hợp với mục tiêu nghề nghiệp của bạn. Chúng tôi cung cấp các chương trình học chuẩn quốc tế từ cơ bản đến chuyên gia.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-16 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-6 h-6" />
            <Input 
              placeholder="Bạn đang quan tâm đến kỹ năng nào?..." 
              className="pl-14 h-16 bg-white border-none shadow-xl rounded-[2rem] focus-visible:ring-primary text-lg font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-80">
            <Select value={levelFilter} onValueChange={(val) => setLevelFilter(val || 'all')}>
              <SelectTrigger className="h-16 bg-white border-none shadow-xl rounded-[2rem] px-8 font-bold text-primary">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-secondary" />
                  <SelectValue placeholder="Tất cả cấp độ" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-2 border-none shadow-2xl">
                <SelectItem value="all" className="rounded-xl font-bold py-3 px-4">Tất cả cấp độ</SelectItem>
                <SelectItem value="Cơ bản" className="rounded-xl font-bold py-3 px-4">Cơ bản</SelectItem>
                <SelectItem value="Trung cấp" className="rounded-xl font-bold py-3 px-4">Trung cấp</SelectItem>
                <SelectItem value="Nâng cao" className="rounded-xl font-bold py-3 px-4">Nâng cao</SelectItem>
                <SelectItem value="Chuyên gia" className="rounded-xl font-bold py-3 px-4">Chuyên gia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Categories Bar (Optional but nice) */}
        <div className="flex flex-wrap gap-3 mb-12">
           {['Tất cả', 'Lập trình', 'Thiết kế', 'Marketing', 'Kinh doanh'].map((cat) => (
             <button key={cat} className="px-6 py-2.5 rounded-2xl bg-white text-primary font-bold text-sm shadow-sm hover:bg-primary hover:text-white transition-all">
               {cat}
             </button>
           ))}
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-[2.5rem] bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden group hover:shadow-[0_40px_80px_rgba(26,67,1,0.12)] transition-all duration-500 bg-white hover:-translate-y-3 relative">
                {/* Overlay Link phủ toàn bộ thẻ - Sử dụng Query Param để có độ tin cậy 100% */}
                <Link href={`/courses/view?id=${course.id}`} className="absolute inset-0 z-20" aria-label={`Xem chi tiết ${course.title}`} />
                
                <div className="relative h-64 overflow-hidden">
                  {course.image_url ? (
                    <Image src={course.image_url} alt={course.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="bg-slate-100 w-full h-full" />
                  )}
                  <div className="absolute top-6 left-6 z-30">
                    <Badge className="bg-white/95 text-primary border-none font-black px-4 py-1.5 rounded-xl backdrop-blur-md shadow-sm uppercase text-[10px] tracking-widest">
                      {course.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-8 space-y-6 relative z-30">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4 text-secondary translate-y-[-1px]" /> {course.duration}
                    </div>
                    <div className="flex items-center gap-2">
                       <Layers className="w-4 h-4 text-secondary translate-y-[-1px]" /> {course.level || 'Cơ bản'}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-primary line-clamp-2 min-h-[4rem] group-hover:text-secondary transition-colors leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-md text-slate-500 line-clamp-2 leading-relaxed font-medium">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Học phí</span>
                      <span className="text-2xl font-black text-primary">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                      </span>
                    </div>
                    <Button size="icon" className="w-14 h-14 rounded-2xl bg-primary text-white group-hover:bg-secondary transition-all shadow-xl shadow-primary/20">
                       <ArrowRight className="w-6 h-6" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {!loading && filteredCourses.length === 0 && (
          <div className="py-32 text-center bg-white rounded-[3rem] shadow-sm">
             <BookOpen className="w-16 h-16 text-slate-100 mx-auto mb-6" />
             <p className="text-slate-400 text-xl font-bold">Không tìm thấy khóa học nào phù hợp.</p>
          </div>
        )}
      </div>
    </div>
  )
}
