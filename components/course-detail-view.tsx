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
import { useRouter } from 'next/navigation'
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
  const router = useRouter()

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
        router.refresh()
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'center_info' 
      }, (payload) => {
        setCenterInfo(payload.new as CenterInfo)
        router.refresh()
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
      
      const result = await submitContact(formData)
      if (result?.error) throw new Error(result.error)
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
            
            {/* Instructor Simple Info */}
            {course.instructor_name && (
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 w-fit backdrop-blur-sm">
                 <div className="bg-secondary/20 p-2 rounded-xl">
                   <Users className="w-6 h-6 text-secondary" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-0.5">Giảng viên hướng dẫn</p>
                    <p className="font-bold text-lg">{course.instructor_name} <span className="text-sm font-medium text-white/60 ml-2">| {course.instructor_role}</span></p>
                 </div>
              </div>
            )}

            <p className="text-xl text-white/70 max-w-2xl leading-relaxed font-medium">
              {course.description}
            </p>
            
            <div className="flex flex-wrap gap-10 pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2.5 rounded-xl">
                  <PlayCircle className="text-secondary w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Phương thức</span>
                  <span className="font-bold">Học trực tiếp/Online</span>
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
                  <TabsTrigger value="instructor" className="rounded-none h-full px-0 font-black uppercase text-xs tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-secondary transition-all shrink-0">
                    Đội ngũ chuyên gia
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-10 md:p-16 space-y-16">
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black text-primary flex items-center gap-4">
                      <span className="w-2 h-10 bg-secondary rounded-full" />
                      Giới thiệu khóa học
                    </h3>
                    <div className="text-slate-600 leading-loose text-lg font-medium space-y-6 whitespace-pre-line">
                       {course.content?.overview || 'Thông tin chi tiết đang được cập nhật.'}
                    </div>
                  </div>

                  {/* Mục tiêu & Đối tượng Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {course.learning_goals && (
                      <div className="space-y-6 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                        <h4 className="text-xl font-black text-primary flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-secondary" /> Mục tiêu khóa học
                        </h4>
                        <div className="text-slate-600 font-medium whitespace-pre-line leading-relaxed">
                          {course.learning_goals}
                        </div>
                      </div>
                    )}
                    {course.target_audience && (
                      <div className="space-y-6 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                        <h4 className="text-xl font-black text-primary flex items-center gap-3">
                          <Users className="w-5 h-5 text-secondary" /> Đối tượng học viên
                        </h4>
                        <div className="text-slate-600 font-medium whitespace-pre-line leading-relaxed">
                          {course.target_audience}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {[
                       'Cam kết đầu ra chuẩn doanh nghiệp',
                       'Giáo trình cập nhật xu hướng mới nhất',
                       'Hỗ trợ thực chiến cùng chuyên gia',
                       'Kết nối cơ hội việc làm uy tín',
                     ].map((item, idx) => (
                       <div key={idx} className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-secondary">
                          <CheckCircle2 className="text-secondary w-6 h-6 shrink-0" />
                          <span className="font-bold text-slate-700">{item}</span>
                       </div>
                     ))}
                  </div>
                </TabsContent>

                <TabsContent value="curriculum" className="p-10 md:p-16">
                   <h3 className="text-3xl font-black text-primary mb-10 flex items-center gap-4">
                      <span className="w-2 h-10 bg-secondary rounded-full" />
                      Lộ trình đào tạo chi tiết
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
                        <p className="text-slate-400 font-bold italic text-lg text-center">Nội dung lộ trình đang được xây dựng chuyên sâu cho từng bài học...</p>
                     </div>
                   )}
                </TabsContent>

                <TabsContent value="instructor" className="p-10 md:p-16">
                  <div className="space-y-10">
                    <h3 className="text-3xl font-black text-primary flex items-center gap-4">
                      <span className="w-2 h-10 bg-secondary rounded-full" />
                      Giảng viên hướng dẫn
                    </h3>
                    <div className="bg-slate-50 rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-10 border border-slate-100">
                       <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-5xl font-black ring-8 ring-white shadow-xl">
                          {course.instructor_name?.charAt(0) || 'E'}
                       </div>
                       <div className="text-center md:text-left space-y-4">
                          <div>
                            <h4 className="text-2xl font-black text-primary">{course.instructor_name || 'Chuyên gia EduCenter'}</h4>
                            <p className="text-secondary font-bold uppercase tracking-widest text-xs">{course.instructor_role || 'Senior Expert'}</p>
                          </div>
                          <p className="text-slate-500 font-medium italic">"Với nhiều năm kinh nghiệm thực chiến trong lĩnh vực, tôi cam kết đồng hành cùng các bạn để đạt được kết quả đào tạo tốt nhất."</p>
                          <div className="flex gap-4 pt-2 justify-center md:justify-start">
                             <Badge className="bg-white text-slate-400 border shadow-sm px-4 py-1 rounded-full">Chuyên gia thực chiến</Badge>
                             <Badge className="bg-white text-slate-400 border shadow-sm px-4 py-1 rounded-full">Hỗ trợ 1-1</Badge>
                          </div>
                       </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Consultation Form Card */}
            <Card id="consultation" className="border-none shadow-2xl rounded-[3rem] bg-white p-12 md:p-16 relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full blur-2xl" />
               <div className="space-y-12 relative z-10">
                 <div className="space-y-4 text-center md:text-left">
                    <Badge className="bg-secondary/10 text-secondary border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Đăng ký tư vấn miễn phí</Badge>
                    <h3 className="text-4xl font-black text-primary leading-tight">Bạn đã sẵn sàng để trở thành <br /><span className="text-secondary italic underline decoration-wavy decoration-8 underline-offset-8">phiên bản tốt hơn?</span></h3>
                 </div>

                 <form onSubmit={handleConsultation} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input name="name" placeholder="Họ và tên học viên" required className="h-16 rounded-2xl bg-slate-50 border-none shadow-sm focus-visible:ring-secondary text-lg px-6" />
                    <Input name="phone" placeholder="Số điện thoại liên hệ" required className="h-16 rounded-2xl bg-slate-50 border-none shadow-sm focus-visible:ring-secondary text-lg px-6" />
                    <Input name="email" type="email" placeholder="Địa chỉ Email (nếu có)" className="h-16 rounded-2xl bg-slate-50 border-none shadow-sm focus-visible:ring-secondary text-lg px-6 md:col-span-2" />
                    <Button type="submit" disabled={formLoading} className="md:col-span-2 h-16 bg-primary hover:bg-secondary text-white font-black text-xl rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95">
                       {formLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-3" />}
                       Gửi yêu cầu nhận tư vấn ngay
                    </Button>
                 </form>
                 <p className="text-center text-slate-400 font-medium italic">Chúng tôi cam kết bảo mật thông tin và sẽ gọi lại hỗ trợ trong vòng 15-30 phút.</p>
               </div>
            </Card>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="space-y-8">
            <div className="sticky top-32">
              <Card className="border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden rounded-[4rem] group bg-white">
                <div className="relative h-64">
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
                  
                  {course.discount_percent && (
                    <div className="absolute top-6 right-6 bg-red-500 text-white font-black px-4 py-2 rounded-xl text-xl shadow-xl animate-bounce">
                      -{course.discount_percent}%
                    </div>
                  )}
                </div>
                <CardContent className="p-10 space-y-8">
                  <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mức học phí ưu đãi</span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <span className="text-5xl font-black text-primary tracking-tight">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                        </span>
                      </div>
                      {course.original_price && (
                        <div className="flex items-center gap-2 mt-2 pl-1">
                          <span className="text-lg font-bold text-slate-300 line-through">
                             {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.original_price)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                     {course.external_form_url ? (
                       <a 
                          href={course.external_form_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={cn(buttonVariants({ size: "lg" }), "w-full h-16 bg-secondary hover:bg-secondary/90 text-white font-black text-xl rounded-2xl shadow-2xl shadow-secondary/30 transition-all active:scale-95 flex items-center justify-center")}
                        >
                          Đăng ký ngay <ChevronRight className="ml-2 w-5 h-5" />
                       </a>
                     ) : (
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
                          className={cn(buttonVariants({ size: "lg" }), "w-full h-16 bg-secondary hover:bg-secondary/90 text-white font-black text-xl rounded-2xl shadow-2xl shadow-secondary/30 transition-all active:scale-95 flex items-center justify-center")}
                        >
                          Đăng ký ngay <ChevronRight className="ml-2 w-5 h-5" />
                       </Link>
                     )}
                     
                    <a 
                      href={centerInfo?.zalo_url || '#'} 
                      target="_blank"
                      className={cn(buttonVariants({ variant: "outline" }), "w-full h-16 border-2 border-primary text-primary hover:bg-primary/5 font-black text-xl rounded-2xl group")}
                    >
                      <PhoneCall className="mr-2 w-5 h-5 group-hover:animate-shake" /> Chat Tư vấn Zalo
                    </a>
                  </div>

                  <div className="space-y-6 pt-10 border-t border-slate-100 text-sm">
                    <p className="font-black text-slate-400 uppercase tracking-widest text-[10px] text-center">Cam kết của trung tâm</p>
                    <div className="grid gap-5">
                      {[
                        { icon: Award, text: 'Chứng nhận tốt nghiệp uy tín' },
                        { icon: Layers, text: 'Tài liệu học tập chuyên nghiệp' },
                        { icon: Users, text: 'Mạng lưới HR hơn 12,000 học viên' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 group">
                          <div className="bg-secondary/10 p-2.5 rounded-xl group-hover:bg-secondary transition-all">
                             <item.icon className="w-5 h-5 text-secondary group-hover:text-white" />
                          </div>
                          <span className="font-bold text-slate-700">{item.text}</span>
                        </div>
                      ))}
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

  )
}
