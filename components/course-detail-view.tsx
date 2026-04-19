'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  BookOpen, 
  Clock, 
  Users, 
  CheckCircle2, 
  PlayCircle, 
  Calendar,
  Award,
  Layers,
  PhoneCall,
  ChevronRight,
  Send,
  Loader2,
  Sparkles
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from '@/utils/supabase/client'
import { Course, CenterInfo } from '@/types'
import { cn } from '@/lib/utils'
import { submitContact } from '@/app/actions'
import { toast } from 'sonner'

export function CourseDetailView({ 
  initialCourse, 
  initialCenterInfo 
}: { 
  initialCourse: Course, 
  initialCenterInfo: CenterInfo | null 
}) {
  const [course, setCourse] = useState<Course>(initialCourse)
  const [centerInfo, setCenterInfo] = useState<CenterInfo | null>(initialCenterInfo)
  const [formLoading, setFormLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Realtime sync
    const channel = supabase
      .channel('course-detail')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'courses', 
        filter: `id=eq.${initialCourse.id}` 
      }, (payload) => {
        setCourse(payload.new as Course)
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'center_info' 
      }, (payload) => {
        setCenterInfo(payload.new as CenterInfo)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [initialCourse.id])

  async function handleConsultation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      formData.append('courseId', course.id)
      formData.append('type', 'consultation')
      formData.append('message', `Yêu cầu tư vấn khóa học: ${course.title}`)
      
      await submitContact(formData)
      toast.success("Yêu cầu tư vấn đã được gửi! Chúng tôi sẽ gọi cho bạn sớm.")
      e.currentTarget.reset()
    } catch (error: any) {
      toast.error("Lỗi: " + error.message)
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Page Header / Banner */}
      <section className="bg-primary pt-40 pb-56 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/10 -skew-x-12 transform translate-x-32" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-secondary text-white border-none py-1.5 px-4 rounded-xl font-black uppercase text-[10px] tracking-widest">
                {course.category}
              </Badge>
              <Badge variant="outline" className="text-white/60 border-white/20 py-1.5 px-4 rounded-xl font-black uppercase text-[10px] tracking-widest">
                {course.level || 'Cơ bản'}
              </Badge>
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[1.05] tracking-tight">
              {course.title}
            </h1>
            <p className="text-xl text-white/70 max-w-2xl leading-relaxed font-medium">
              {course.description}
            </p>
            <div className="flex flex-wrap gap-10 pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2.5 rounded-xl">
                  <Users className="text-secondary w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Học viên</span>
                  <span className="font-bold">1,200+</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2.5 rounded-xl">
                  <Calendar className="text-secondary w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Lịch học</span>
                  <span className="font-bold">{course.schedule || 'Sắp công bố'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2.5 rounded-xl">
                  <Clock className="text-secondary w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Thời lượng</span>
                  <span className="font-bold">{course.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 -mt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Course Info */}
          <div className="lg:col-span-2 space-y-12">
            <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-white h-20 px-10 gap-10 overflow-x-auto overflow-y-hidden no-scrollbar">
                  <TabsTrigger value="overview" className="rounded-none h-full px-0 font-black uppercase text-xs tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-secondary transition-all shrink-0">
                    Tổng quan
                  </TabsTrigger>
                  <TabsTrigger value="curriculum" className="rounded-none h-full px-0 font-black uppercase text-xs tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-secondary transition-all shrink-0">
                    Lộ trình học tập
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-10 md:p-16 space-y-12">
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black text-primary flex items-center gap-4">
                      <span className="w-2 h-10 bg-secondary rounded-full" />
                      Chi tiết khóa học
                    </h3>
                    <div className="text-slate-600 leading-loose text-lg font-medium space-y-6">
                       {course.content?.overview || 'Thông tin chi tiết đang được cập nhật. Vui lòng liên hệ trung tâm để biết thêm chi tiết.'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                     {[
                       'Giảng viên chuyên gia hàng đầu',
                       'Giáo trình thực tiễn 100%',
                       'Hỗ trợ trọn đời sau khóa học',
                       'Cấp chứng chỉ uy tín',
                     ].map((item, idx) => (
                       <div key={idx} className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:border-secondary transition-colors">
                          <CheckCircle2 className="text-secondary w-6 h-6 shrink-0" />
                          <span className="font-bold text-slate-700">{item}</span>
                       </div>
                     ))}
                  </div>
                </TabsContent>

                <TabsContent value="curriculum" className="p-10 md:p-16">
                   <h3 className="text-3xl font-black text-primary mb-10 flex items-center gap-4">
                      <span className="w-2 h-10 bg-secondary rounded-full" />
                      Nội dung lộ trình
                   </h3>
                   {course.content?.curriculum?.length > 0 ? (
                      <Accordion className="w-full space-y-4">
                        {course.content.curriculum.map((section, idx) => (
                          <AccordionItem key={idx} value={`item-${idx}`} className="border-none rounded-[2rem] px-8 bg-slate-50 shadow-sm overflow-hidden transition-all data-[state=open]:bg-primary/5">
                            <AccordionTrigger className="hover:no-underline font-black text-xl text-primary py-8 text-left">
                              <div className="flex items-center gap-4">
                                 <span className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center text-xs">{idx + 1}</span>
                                 {section.title}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-8 pl-12">
                              <ul className="space-y-4">
                                {section.lessons.map((lesson, lIdx) => (
                                  <li key={lIdx} className="flex items-center gap-4 text-slate-600 font-medium group cursor-pointer hover:text-primary transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-secondary group-hover:scale-150 transition-transform" />
                                    <span>{lesson}</span>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                   ) : (
                     <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold italic text-lg">Nội dung lộ trình đang được xây dựng chuyên sâu...</p>
                     </div>
                   )}
                </TabsContent>
              </Tabs>
            </Card>

            {/* Consultation Form Card */}
            <Card id="consultation" className="border-none shadow-2xl rounded-[3rem] bg-white p-12 md:p-16 relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full blur-2xl" />
               <div className="space-y-12 relative z-10">
                 <div className="space-y-4">
                    <Badge className="bg-secondary/10 text-secondary border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Đăng ký tư vấn miễn phí</Badge>
                    <h3 className="text-4xl font-black text-primary leading-tight">Bắt đầu hành trình <br /><span className="text-secondary italic">của bạn ngay hôm nay!</span></h3>
                 </div>

                 <form onSubmit={handleConsultation} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input name="name" placeholder="Họ và tên học viên" required className="h-16 rounded-2xl bg-slate-50 border-none shadow-sm focus-visible:ring-secondary text-lg px-6" />
                    <Input name="phone" placeholder="Số điện thoại liên hệ" required className="h-16 rounded-2xl bg-slate-50 border-none shadow-sm focus-visible:ring-secondary text-lg px-6" />
                    <Input name="email" type="email" placeholder="Địa chỉ Email (nếu có)" className="h-16 rounded-2xl bg-slate-50 border-none shadow-sm focus-visible:ring-secondary text-lg px-6 md:col-span-2" />
                    <Button type="submit" disabled={formLoading} className="md:col-span-2 h-16 bg-primary hover:bg-secondary text-white font-black text-xl rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95">
                       {formLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-3" />}
                       Gửi yêu cầu nhận tư vấn
                    </Button>
                 </form>
                 <p className="text-center text-slate-400 font-medium italic">Chúng tôi cam kết bảo mật thông tin và sẽ gọi lại hỗ trợ trong vòng 15-30 phút.</p>
               </div>
            </Card>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="space-y-8">
            <div className="sticky top-32">
              <Card className="border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden rounded-[3rem] group bg-white">
                <div className="relative h-60">
                  {course.image_url ? (
                    <Image
                      src={course.image_url}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="bg-slate-100 w-full h-full" />
                  )}
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <PlayCircle className="text-white w-20 h-20" />
                  </div>
                </div>
                <CardContent className="p-10 space-y-8">
                  <div className="space-y-2">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Học phí trọn gói</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-primary tracking-tight">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                     <Link 
                        href="#consultation" 
                        onClick={(e) => {
                          e.preventDefault();
                          const element = document.getElementById('consultation');
                          if (element) {
                            window.scrollTo({
                              top: element.offsetTop - 100,
                              behavior: 'smooth'
                            });
                          }
                        }}
                        className={cn(buttonVariants({ size: "lg" }), "w-full h-16 bg-secondary hover:bg-secondary/90 text-white font-black text-xl rounded-2xl shadow-2xl shadow-secondary/30 transition-all")}
                      >
                        Đăng ký ngay
                     </Link>
                    <a 
                      href={centerInfo?.zalo_url || '#'} 
                      target="_blank"
                      className={cn(buttonVariants({ variant: "outline" }), "w-full h-16 border-2 border-primary text-primary hover:bg-primary/5 font-black text-xl rounded-2xl")}
                    >
                      <PhoneCall className="mr-2 w-5 h-5" /> Chat Tư vấn Zalo
                    </a>
                  </div>

                  <div className="space-y-6 pt-8 border-t border-slate-50 text-sm">
                    <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Đặc quyền học viên</p>
                    <div className="grid gap-5">
                      <div className="flex items-center gap-4 group">
                        <div className="bg-secondary/10 p-2 rounded-lg group-hover:bg-secondary transition-colors">
                           <Award className="w-5 h-5 text-secondary group-hover:text-white" />
                        </div>
                        <span className="font-bold text-slate-700">Chứng nhận hoàn thành</span>
                      </div>
                      <div className="flex items-center gap-4 group">
                        <div className="bg-secondary/10 p-2 rounded-lg group-hover:bg-secondary transition-colors">
                           <Layers className="w-5 h-5 text-secondary group-hover:text-white" />
                        </div>
                        <span className="font-bold text-slate-700">Tài liệu học tập miễn phí</span>
                      </div>
                      <div className="flex items-center gap-4 group">
                        <div className="bg-secondary/10 p-2 rounded-lg group-hover:bg-secondary transition-colors">
                           <Users className="w-5 h-5 text-secondary group-hover:text-white" />
                        </div>
                        <span className="font-bold text-slate-700">Tham gia cộng đồng học tập</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
