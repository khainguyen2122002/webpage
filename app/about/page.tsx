'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Target, Heart, Shield, Sparkles, MapPin, Phone, Mail, Loader2, Award, Users, Rocket } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/client'
import { CenterInfo } from '@/types'

const values = [
  {
    icon: Rocket,
    title: 'Tầm nhìn',
    desc: 'Trở thành hệ thống đào tạo dẫn đầu về chất lượng và sự đổi mới tại Việt Nam.'
  },
  {
    icon: Heart,
    title: 'Tận tâm',
    desc: 'Đặt học viên làm trung tâm trong mọi hoạt động giảng dạy và hỗ trợ.'
  },
  {
    icon: Shield,
    title: 'Uy tín',
    desc: 'Cam kết mang lại giá trị thực chất và hiệu quả hữu hình sau mỗi khóa học.'
  },
  {
    icon: Sparkles,
    title: 'Sáng tạo',
    desc: 'Không ngừng cập nhật phương pháp dạy và học tiên tiến nhất thế giới.'
  }
]

const team = [
  {
    name: 'Nguyễn Văn Khải',
    role: 'Giám đốc Trung tâm',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop'
  },
  {
    name: 'Đặng Thùy Dương',
    role: 'Trưởng phòng Đào tạo',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop'
  },
  {
    name: 'Lê Hoàng Nam',
    role: 'Giảng viên cấp cao',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop'
  }
]

export default function AboutPage() {
  const [centerInfo, setCenterInfo] = useState<CenterInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('center_info')
        .select('*')
        .single()
      
      if (data) setCenterInfo(data as CenterInfo)
      setLoading(false)
    }
    fetchData()

    // Realtime sync
    const channel = supabase
      .channel('about-data')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'center_info' }, (payload) => {
        setCenterInfo(payload.new as CenterInfo)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
       <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  )

  return (
    <div className="flex flex-col gap-32 pb-32 bg-white">
      {/* Intro Section */}
      <section className="bg-primary pt-48 pb-56 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/10 -skew-x-12 transform translate-x-32" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <Badge className="bg-secondary text-white border-none py-2 px-6 rounded-full font-black uppercase text-[10px] tracking-[0.3em] mb-8">
             Câu chuyện thương hiệu
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter mb-8">
             Kiến Tạo <br /> Những <span className="text-secondary italic">Giá Trị Thực</span>
          </h1>
          <p className="text-2xl text-white/70 leading-relaxed font-medium">
             Chào mừng bạn đến với {centerInfo?.name || 'trung tâm đào tạo'} - nơi chúng tôi không chỉ dạy kỹ năng, mà còn chắp cánh cho những ước mơ vượt bậc.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 -mt-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center bg-white p-12 md:p-24 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-50">
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-slate-50">
             <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1170&auto=format&fit=crop"
              alt="Center Office"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            <div className="absolute bottom-10 left-10 text-white">
               <p className="text-5xl font-black italic">10+</p>
               <p className="text-xs font-black uppercase tracking-widest text-white/80">Năm kinh nghiệm</p>
            </div>
          </div>
          <div className="space-y-10">
            <div className="space-y-6">
              <Badge className="bg-secondary/10 text-secondary py-2 px-5 rounded-2xl border-none uppercase text-[10px] tracking-widest font-black">
                {centerInfo?.slogan || 'Tầm nhìn chiến lược'}
              </Badge>
              <h2 className="text-5xl md:text-6xl font-black text-primary leading-tight tracking-tight">Kinh nghiệm thực tế, <br />Thành công vững bền</h2>
              <div className="space-y-6 text-slate-500 leading-loose text-xl font-medium">
                <p>
                  {centerInfo?.description || 'Tại trung tâm, chúng tôi tin rằng giáo dục là chìa khóa để mở ra mọi cánh cửa thành công. Một lộ trình bài bản và môi trường thực chiến là những gì bạn sẽ nhận được.'}
                </p>
                <div className="grid grid-cols-2 gap-8 pt-6">
                   <div className="space-y-2">
                      <div className="flex items-center gap-3 text-secondary">
                         <Award className="w-6 h-6" />
                         <span className="font-black text-primary">Chứng nhận</span>
                      </div>
                      <p className="text-sm font-medium">Bằng cấp chuẩn quốc tế được công nhận rộng rãi.</p>
                   </div>
                   <div className="space-y-2">
                      <div className="flex items-center gap-3 text-secondary">
                         <Users className="w-6 h-6" />
                         <span className="font-black text-primary">Cộng đồng</span>
                      </div>
                      <p className="text-sm font-medium">Tham gia mạng lưới học viên tài năng toàn quốc.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4">
        <div className="text-center space-y-6 mb-24 max-w-2xl mx-auto">
          <Badge className="bg-primary/5 text-primary border-none py-1.5 px-6 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Giá trị cốt lõi</Badge>
          <h2 className="text-5xl font-black text-primary tracking-tight">Điều tạo nên <span className="text-secondary italic">sự khác biệt</span></h2>
          <p className="text-slate-400 text-xl font-medium leading-relaxed">Chúng tôi xây dựng trung tâm dựa trên những cam kết vững chắc với học viên.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {values.map((val, idx) => (
            <Card key={idx} className="border-none shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] group bg-white hover:-translate-y-4">
              <CardContent className="p-10 text-center space-y-8">
                <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto group-hover:bg-primary transition-all duration-500 rotate-3 group-hover:rotate-12 group-hover:scale-110 shadow-sm">
                  <val.icon className="text-primary w-10 h-10 group-hover:text-white transition-colors" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-primary">{val.title}</h3>
                  <p className="text-slate-500 text-md leading-relaxed font-medium">{val.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-slate-50 py-32 rounded-[5rem] container mx-auto px-4">
        <div className="text-center space-y-6 mb-24">
          <Badge className="bg-secondary/10 text-secondary border-none py-1.5 px-6 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Đội ngũ giảng viên</Badge>
          <h2 className="text-5xl font-black text-primary tracking-tight">Học cùng những <span className="text-secondary italic">chuyên gia</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
          {team.map((member, idx) => (
            <div key={idx} className="group text-center space-y-8">
              <div className="relative aspect-[3/4] rounded-[4rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] border-[10px] border-white ring-1 ring-slate-100">
                <Image src={member.image} alt={member.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
              </div>
              <div className="space-y-2">
                <h4 className="text-3xl font-black text-primary">{member.name}</h4>
                <p className="text-secondary font-black uppercase text-[10px] tracking-[0.3em]">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Stats Section */}
      <section className="container mx-auto px-4">
        <div className="bg-primary rounded-[4rem] p-16 md:p-32 flex flex-col lg:flex-row shadow-2xl items-center gap-16 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 -skew-x-12 translate-x-24 z-0" />
           <div className="lg:w-1/2 text-white space-y-10 relative z-10 text-center lg:text-left">
             <h2 className="text-5xl md:text-7xl font-black leading-tight">Gia nhập cùng <br /> cộng đồng của <span className="text-secondary italic">chúng tôi</span></h2>
             <p className="text-xl text-white/70 leading-relaxed font-medium">Bắt đầu hành trình chinh phục kỹ năng mới và thay đổi sự nghiệp của bạn ngay hôm nay cùng {centerInfo?.name}.</p>
             <div className="flex gap-6 justify-center lg:justify-start">
                <div className="flex flex-col">
                   <span className="text-4xl font-black text-secondary">10k+</span>
                   <span className="text-xs font-bold uppercase tracking-widest text-white/40">Học viên</span>
                </div>
                <div className="w-[1px] h-12 bg-white/10" />
                <div className="flex flex-col">
                   <span className="text-4xl font-black text-secondary">500+</span>
                   <span className="text-xs font-bold uppercase tracking-widest text-white/40">Đối tác</span>
                </div>
                <div className="w-[1px] h-12 bg-white/10" />
                <div className="flex flex-col">
                   <span className="text-4xl font-black text-secondary">98%</span>
                   <span className="text-xs font-bold uppercase tracking-widest text-white/40">Hài lòng</span>
                </div>
             </div>
           </div>
           <div className="lg:w-1/2 relative z-10 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                 <div className="h-40 rounded-3xl bg-secondary/10" />
                 <div className="h-60 rounded-[3rem] bg-white/5 backdrop-blur-md border border-white/10" />
              </div>
              <div className="space-y-4 pt-12">
                 <div className="h-60 rounded-[3rem] bg-secondary" />
                 <div className="h-40 rounded-3xl bg-white/10" />
              </div>
           </div>
        </div>
      </section>
    </div>
  )
}
