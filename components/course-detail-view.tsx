'use client'

import { Course, CenterInfo } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Layers, ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function CourseDetailView({ 
  initialCourse, 
  initialCenterInfo 
}: { 
  initialCourse: Course, 
  initialCenterInfo: CenterInfo | null 
}) {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Quay lại */}
        <Link href="/courses" className="flex items-center gap-2 text-slate-400 hover:text-primary mb-8 font-bold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cột trái: Thông tin chính */}
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-4xl md:text-6xl font-black text-primary leading-tight">
              {initialCourse.title}
            </h1>
            
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-primary/5 text-primary border-none px-4 py-1.5 rounded-lg font-bold">
                {initialCourse.category}
              </Badge>
              <Badge variant="outline" className="border-slate-200 text-slate-400 px-4 py-1.5 rounded-lg font-bold">
                {initialCourse.level || 'Cơ bản'}
              </Badge>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-xl text-slate-500 leading-relaxed whitespace-pre-line">
                {initialCourse.description}
              </p>
            </div>

            <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
              <h3 className="text-2xl font-bold text-primary mb-6">Mô tả chi tiết</h3>
              <div className="text-slate-600 leading-loose whitespace-pre-line">
                {initialCourse.content?.overview || 'Thông tin chi tiết đang được cập nhật...'}
              </div>
            </Card>
          </div>

          {/* Cột phải: Thẻ đăng ký */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <div className="relative h-56">
                {initialCourse.image_url ? (
                  <Image src={initialCourse.image_url} alt={initialCourse.title} fill className="object-cover" />
                ) : (
                  <div className="bg-slate-100 w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                )}
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Học phí</span>
                  <p className="text-4xl font-black text-primary">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(initialCourse.price)}
                  </p>
                </div>

                <div className="flex flex-col gap-4 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-secondary" /> <span>Thời lượng: {initialCourse.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-secondary" /> <span>Cấp độ: {initialCourse.level || 'Cơ bản'}</span>
                  </div>
                </div>

                <Button className="w-full h-14 bg-primary hover:bg-secondary text-white font-bold text-lg rounded-2xl shadow-lg transition-all">
                  Đăng ký tư vấn ngay
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
