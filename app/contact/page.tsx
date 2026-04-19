'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Loader2, MessageSquare, User, AtSign, PhoneOutgoing } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { submitContact } from '@/app/actions'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      await submitContact(formData)
      toast.success("Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.")
      e.currentTarget.reset()
    } catch (error: any) {
      toast.error("Lỗi: " + error.message)
    } finally {
      setLoading(false)
    }
  }

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
                       <p className="text-white/70 text-lg leading-relaxed">Số 123, Đường Cách Mạng Tháng 8, Quận 10, TP. Hồ Chí Minh</p>
                     </div>
                   </div>

                   <div className="flex gap-6 items-start">
                     <div className="bg-secondary p-4 rounded-2xl shrink-0 shadow-lg">
                       <PhoneOutgoing className="text-white w-7 h-7" />
                     </div>
                     <div>
                       <h4 className="font-bold text-xl mb-1 text-secondary">Điện thoại</h4>
                       <p className="text-white/70 text-lg leading-relaxed">0123 456 789</p>
                     </div>
                   </div>

                   <div className="flex gap-6 items-start">
                     <div className="bg-secondary p-4 rounded-2xl shrink-0 shadow-lg">
                       <AtSign className="text-white w-7 h-7" />
                     </div>
                     <div>
                       <h4 className="font-bold text-xl mb-1 text-secondary">Email</h4>
                       <p className="text-white/70 text-lg leading-relaxed">contact@educenter.vn</p>
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
            <CardContent className="p-0 space-y-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-primary">Gửi tin nhắn</h3>
                <p className="text-slate-400 font-medium italic">Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <Input 
                      name="name"
                      placeholder="Họ và tên của bạn" 
                      required
                      className="pl-12 h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-primary text-md"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <Input 
                        name="email"
                        type="email"
                        placeholder="Địa chỉ Email" 
                        required
                        className="pl-12 h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-primary text-md"
                      />
                    </div>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <Input 
                        name="phone"
                        placeholder="Số điện thoại" 
                        required
                        className="pl-12 h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-primary text-md"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <MessageSquare className="absolute left-4 top-6 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <Textarea 
                      name="message"
                      placeholder="Lời nhắn của bạn..." 
                      className="pl-12 pt-5 min-h-[160px] bg-slate-50 border-none rounded-3xl focus-visible:ring-primary text-md"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black text-xl rounded-2xl shadow-2xl shadow-primary/20 transition-all active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ) : (
                    <>Gửi tin nhắn <Send className="ml-2 w-5 h-5" /></>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
