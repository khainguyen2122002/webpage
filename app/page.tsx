import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen, Users, Award, CheckCircle2, Star, Sparkles, PhoneCall, Clock, Layers, Globe } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/server'
import { Course, CenterInfo } from '@/types'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()

  const { data: centerData } = await supabase
    .from('center_info')
    .select('*')
    .eq('id', '00000000-0000-0000-0000-000000000000')
    .single()

  const { data: coursesData } = await supabase
    .from('courses')
    .select('*')
    .eq('is_featured', true)
    .limit(3)

  const centerInfo = centerData as CenterInfo
  const featuredCourses = (coursesData as Course[]) || []

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Redesigned to User Specs */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={centerInfo?.banner_url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"} 
            alt="Modern Classroom" 
            fill
            priority
            className="object-cover"
          />
          {/* Dark Green Overlay #0A3D2B @ 65% */}
          <div className="absolute inset-0 bg-[#0A3D2B]/65 backdrop-blur-[2px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-100/90 text-orange-600 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg animate-fade-in-down">
              <Sparkles className="w-4 h-4" /> {centerInfo?.hero_badge_text || 'Chào mừng bạn đến với EduCenter'}
            </div>

            {/* Main Headlines */}
            <h1 className="text-6xl md:text-9xl font-black leading-[1.1] tracking-tighter text-white drop-shadow-2xl">
              Khởi Nguồn Tri <br />
              <span className="text-[#FCD34D]">Thức Kiến Tạo</span> <br />
              Tương Lai
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium max-w-2xl mx-auto drop-shadow-md">
              {centerInfo?.description || 'Hệ thống đào tạo chuẩn quốc tế với đội ngũ chuyên gia hàng đầu. Chúng tôi cam kết mang lại giá trị thực tiễn nhất cho học viên.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-6 pt-10">
              <Link 
                href="/courses" 
                className={cn(buttonVariants({ size: "lg" }), "bg-orange-500 hover:bg-orange-600 text-white font-black h-20 px-12 rounded-2xl shadow-2xl shadow-orange-500/30 transition-all hover:-translate-y-2 text-xl")}
              >
                {centerInfo?.cta_primary_text || 'Khám phá khóa học'} <ArrowRight className="ml-3 w-7 h-7" />
              </Link>
              <Link 
                 href={centerInfo?.cta_secondary_url || '#'}
                 className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-2 border-white text-white font-black h-20 px-12 rounded-2xl transition-all hover:bg-white/10 bg-transparent text-xl")}
              >
                <PhoneCall className="mr-3 w-6 h-6" /> {centerInfo?.cta_secondary_text || 'Tư vấn ngay'}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
           <div className="w-1 h-12 rounded-full bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      {/* Stats Section - 2 Separate Blocks Redesigned */}
      {centerInfo?.show_stats && (
        <section className="relative z-20 py-20 bg-slate-50">
          <div className="container mx-auto px-4 space-y-12">
            {/* Block 1: 3 Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Học viên', value: `${(centerInfo?.stats_students || 12000).toLocaleString()}+`, icon: Users, color: 'text-blue-500' },
                { label: 'Khóa học', value: `${centerInfo?.stats_courses || 50}+`, icon: BookOpen, color: 'text-orange-500' },
                { label: 'Đánh giá', value: `${centerInfo?.stats_rating || 4.9}/5`, icon: Star, color: 'text-[#FCD34D]' },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden group hover:shadow-2xl transition-all duration-500 p-10 text-center space-y-4">
                   <div className={cn("inline-flex p-5 rounded-3xl bg-slate-50 group-hover:bg-primary/5 transition-colors mx-auto", stat.color)}>
                     <stat.icon className="w-12 h-12" />
                   </div>
                   <div className="space-y-1">
                     <p className="text-5xl font-black text-primary tracking-tighter">{stat.value}</p>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                   </div>
                </Card>
              ))}
            </div>

            {/* Block 2: Additional Community & International Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-12 group hover:bg-primary transition-all duration-500">
                  <div className="flex gap-8 items-start">
                     <div className="bg-primary/10 p-5 rounded-3xl group-hover:bg-white/20">
                        <Users className="w-10 h-10 text-primary group-hover:text-white" />
                     </div>
                     <div className="space-y-3">
                        <h4 className="text-2xl font-black text-primary group-hover:text-white">{centerInfo?.community_title || 'Cộng đồng'}</h4>
                        <p className="text-slate-500 group-hover:text-white/80 font-medium leading-relaxed">
                           {centerInfo?.community_text || 'Gia nhập cộng đồng HR hơn 12,000 học viên đã thành công và đang phát triển mạnh mẽ.'}
                        </p>
                     </div>
                  </div>
               </Card>
               <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-12 group hover:bg-secondary transition-all duration-500">
                  <div className="flex gap-8 items-start">
                     <div className="bg-secondary/10 p-5 rounded-3xl group-hover:bg-white/20">
                        <Globe className="w-10 h-10 text-secondary group-hover:text-white" />
                     </div>
                     <div className="space-y-3">
                        <h4 className="text-2xl font-black text-secondary group-hover:text-white">{centerInfo?.international_title || 'Tiêu chuẩn quốc tế'}</h4>
                        <p className="text-slate-500 group-hover:text-white/80 font-medium leading-relaxed">
                           {centerInfo?.international_text || 'Chương trình đào tạo chuẩn quốc tế với đội ngũ chuyên gia hàng đầu trong ngành.'}
                        </p>
                     </div>
                  </div>
               </Card>
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses Title */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-6">
              <Badge className="bg-primary/5 text-primary border-none px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                Chương trình nổi bật 🔥
              </Badge>
              <h2 className="text-5xl md:text-7xl font-black text-primary tracking-tight leading-[1.1]">
                Đánh thức tiềm năng <br />
                <span className="text-secondary italic">với lộ trình đỉnh cao</span>
              </h2>
            </div>
            <Link 
              href="/courses" 
              className={cn(buttonVariants({ variant: "link" }), "text-primary hover:text-secondary group font-black text-xl p-0 h-auto")}
            >
              Xem tất cả khóa học <ArrowRight className="ml-3 w-7 h-7 transition-transform group-hover:translate-x-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] rounded-[3rem] overflow-hidden group hover:shadow-[0_50px_100px_-20px_rgba(26,67,1,0.15)] transition-all duration-700 bg-white hover:-translate-y-5 border-t border-slate-50">
                <div className="relative h-72 overflow-hidden">
                  {course.image_url ? (
                    <Image src={course.image_url} alt={course.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                  ) : (
                    <div className="bg-slate-100 w-full h-full" />
                  )}
                  <div className="absolute top-8 left-8">
                    <Badge className="bg-white/95 text-primary border-none font-black px-5 py-2 rounded-2xl backdrop-blur-md shadow-sm uppercase text-[10px] tracking-widest">
                      {course.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-10 space-y-8">
                  <div className="flex justify-between items-center text-[11px] font-black text-slate-400 uppercase tracking-[2px]">
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4 text-secondary translate-y-[-1px]" /> {course.duration}
                    </div>
                    <div className="flex items-center gap-2">
                       <Layers className="w-4 h-4 text-secondary translate-y-[-1px]" /> {course.level || 'Cơ bản'}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-primary line-clamp-2 min-h-[4rem] leading-tight group-hover:text-secondary transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Học phí ưu đãi</span>
                      <span className="text-3xl font-black text-primary">
                         {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                      </span>
                    </div>
                    <Link href={`/courses/${course.slug}`}>
                       <Button size="icon" className="w-16 h-16 rounded-2xl bg-slate-50 text-secondary hover:bg-secondary hover:text-white transition-all shadow-sm">
                          <ArrowRight className="w-7 h-7" />
                       </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-32">
        <div className="bg-primary rounded-[4rem] p-16 md:p-32 text-center space-y-12 relative overflow-hidden shadow-2xl border-[10px] border-white/5">
           <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 -skew-x-12 translate-x-24 z-0" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 skew-x-12 -translate-x-20 z-0" />
           <div className="relative z-10 space-y-8">
             <h2 className="text-5xl md:text-8xl font-black text-white leading-tight tracking-tighter">
               Bắt Đầu <br />
               <span className="text-secondary italic">Tương Lai Ngay!</span>
             </h2>
             <p className="text-2xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
               Gia nhập cộng đồng HR hơn 12,000 học viên đã thành công. Nhận lộ trình tư vấn cá nhân hóa MIỄN PHÍ.
             </p>
             <div className="pt-10 flex flex-col md:flex-row gap-6 justify-center">
               <Link 
                 href="/contact" 
                 className={cn(buttonVariants({ size: "lg" }), "bg-white text-primary hover:bg-slate-100 font-black h-20 px-16 rounded-3xl text-xl shadow-2xl")}
               >
                 Tư vấn miễn phí
               </Link>
               <Link 
                 href="/courses" 
                 className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-2 border-white/20 text-white hover:bg-white/5 font-black h-20 px-16 rounded-3xl text-xl")}
               >
                 Khám phá khóa học
               </Link>
             </div>
           </div>
        </div>
      </section>
    </div>
  )
}
