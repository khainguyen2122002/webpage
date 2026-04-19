import { Mail, Phone, MapPin, BadgeCheck, PhoneOutgoing, AtSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/server'
import { ContactForm } from '@/components/contact-form'
import { CenterInfo } from '@/types'

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const supabase = await createClient()

  // Fetch real center info
  const { data: centerData } = await supabase
    .from('center_info')
    .select('*')
    .eq('id', '00000000-0000-0000-0000-000000000000')
    .single()

  const centerInfo = centerData as CenterInfo | null

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <Badge className="bg-primary/5 text-primary border-none px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            Liên hệ với chúng tôi ✉️
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-primary tracking-tight">
            Hãy Để Lại <br />
            <span className="text-secondary italic">Lời Nhắn</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed font-medium">
            Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn về các khóa học và chương trình đào tạo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Info Side */}
          <div className="space-y-8">
            <Card className="border-none shadow-2xl rounded-[3rem] bg-primary p-12 text-white relative overflow-hidden h-full">
               <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 -skew-x-12 translate-x-20 z-0" />
               <div className="relative z-10 space-y-12">
                 <h2 className="text-4xl font-black">Thông Tin Liên Hệ</h2>
                 
                 <div className="space-y-10">
                   <div className="flex gap-6 items-start">
                     <div className="bg-secondary p-4 rounded-2xl shrink-0 shadow-lg">
                       <MapPin className="text-white w-7 h-7" />
                     </div>
                     <div>
                       <h4 className="font-bold text-xl mb-1 text-secondary">Văn phòng chính</h4>
                       <p className="text-white/70 text-lg leading-relaxed">{centerInfo?.address || 'Đang cập nhật địa chỉ...'}</p>
                     </div>
                   </div>

                   <div className="flex gap-6 items-start">
                     <div className="bg-secondary p-4 rounded-2xl shrink-0 shadow-lg">
                       <PhoneOutgoing className="text-white w-7 h-7" />
                     </div>
                     <div>
                       <h4 className="font-bold text-xl mb-1 text-secondary">Điện thoại</h4>
                       <p className="text-white/70 text-lg leading-relaxed">{centerInfo?.phone || 'Đang cập nhật số điện thoại...'}</p>
                     </div>
                   </div>

                   <div className="flex gap-6 items-start">
                     <div className="bg-secondary p-4 rounded-2xl shrink-0 shadow-lg">
                       <AtSign className="text-white w-7 h-7" />
                     </div>
                     <div>
                       <h4 className="font-bold text-xl mb-1 text-secondary">Email</h4>
                       <p className="text-white/70 text-lg leading-relaxed">{centerInfo?.email || 'Đang cập nhật email...'}</p>
                     </div>
                   </div>
                 </div>

                 <div className="pt-10 border-t border-white/10">
                    <p className="font-bold text-white/40 uppercase tracking-widest text-xs mb-4">Làm việc</p>
                    <p className="text-white font-medium text-lg">Thứ 2 - Thứ 7: 08:00 - 21:00</p>
                 </div>
               </div>
            </Card>
          </div>

          {/* Form Side */}
          <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-12 overflow-hidden relative">
            <ContactForm />
          </Card>
        </div>
      </div>
    </div>
  )
}

