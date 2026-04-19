'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, MoreHorizontal, Edit, Trash, ExternalLink, Eye, LayoutGrid, List, Filter, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { CourseFormDialog } from '@/components/admin/course-form-dialog'
import { deleteCourse } from '@/app/actions'
import { Course } from '@/types'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchCourses = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      toast.error("Lỗi tải danh sách: " + error.message)
    } else {
      setCourses(data as Course[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCourses()

    // Realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'courses',
        },
        () => {
          fetchCourses()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      try {
        const result = await deleteCourse(id)
        if (result?.error) throw new Error(result.error)
        toast.success("Đã xóa khóa học")
      } catch (error: any) {
        toast.error("Lỗi: " + error.message)
      }
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Quản lý khóa học</h1>
          <p className="text-slate-500">Toàn bộ khóa học hiện có trên hệ thống.</p>
        </div>
        <CourseFormDialog 
          trigger={
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl h-12 px-6 shadow-lg shadow-primary/20">
              <Plus className="w-5 h-5" /> Thêm khóa học mới
            </Button>
          }
        />
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardHeader className="p-8 border-b border-slate-50">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                placeholder="Tìm kiếm theo tên hoặc danh mục..." 
                className="pl-12 h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-primary text-md"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
               <Button variant="outline" className="h-14 rounded-2xl gap-2 border-slate-100">
                  <Filter className="w-4 h-4" /> Lọc
               </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-50 h-16">
                <TableHead className="w-[350px] font-bold text-slate-400 uppercase text-[10px] tracking-widest pl-8">Khóa học</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Danh mục</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest text-center">Cấp độ</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest text-center">Nổi bật</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Học phí</TableHead>
                <TableHead className="text-right pr-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id} className="hover:bg-slate-50/50 transition-colors border-slate-50 h-24">
                  <TableCell className="pl-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                        {course.image_url ? (
                          <Image src={course.image_url} alt={course.title} fill className="object-cover" />
                        ) : (
                          <div className="bg-slate-50 w-full h-full flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-slate-200" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 leading-tight">{course.title}</span>
                        <span className="text-xs text-slate-400 mt-1">{course.duration}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-lg font-bold text-primary bg-primary/5 border-none px-3 py-1">{course.category}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                     <span className="text-sm font-medium text-slate-600">{course.level || 'Cơ bản'}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {course.is_featured ? (
                       <Badge className="bg-amber-100 text-amber-600 border-none rounded-lg font-bold">HOT 🔥</Badge>
                    ) : (
                      <span className="text-slate-200 text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-black text-primary text-lg">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        (
                          <Button variant="ghost" className="h-10 w-10 p-0 text-slate-400 hover:bg-slate-100 rounded-full">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        ) as any
                      } />
                      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-slate-100 shadow-xl">
                        <DropdownMenuLabel className="text-slate-400 font-bold uppercase text-[10px] tracking-widest px-3 py-2">Hành động</DropdownMenuLabel>
                        
                        <CourseFormDialog 
                          course={course}
                          trigger={
                            <div className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-slate-50 rounded-xl transition-colors cursor-pointer w-full font-medium">
                              <Edit className="w-4 h-4 text-secondary" /> Chỉnh sửa
                            </div>
                          }
                        />

                        <Link 
                          href={`/courses/${course.slug}`} 
                          target="_blank"
                          className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-slate-50 rounded-xl transition-colors font-medium"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-500" /> Xem demo
                        </Link>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(course.id)}
                          className="rounded-xl gap-2 px-3 py-2.5 text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer font-medium"
                        >
                          <Trash className="w-4 h-4" /> Xóa khóa học
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredCourses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-32 text-slate-300">
                    <div className="flex flex-col items-center gap-4">
                      <Search className="w-12 h-12 text-slate-100" />
                      <p className="text-lg">Không tìm thấy khóa học nào phù hợp.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
