'use client'

import { useState } from 'react'
import { Send, Loader2, MessageSquare, User, AtSign, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { submitContact } from '@/app/actions'

interface ContactFormProps {
  courseId?: string
  courseTitle?: string
}

export function ContactForm({ courseId, courseTitle }: ContactFormProps) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setLoading(true)
    
    try {
      const formData = new FormData(form)
      if (courseId) formData.append('courseId', courseId)
      
      const result = await submitContact(formData)
      if (result?.error) throw new Error(result.error)
      
      toast.success("Cảm ơn " + (formData.get('name') || "") + "! Chúng tôi sẽ liên hệ lại sớm nhất.")
      form.reset()
    } catch (error: any) {
      toast.error("Lỗi: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CardContent className="p-0 space-y-8">
      <div className="space-y-2">
        <h3 className="text-3xl font-black text-primary">
          {courseTitle ? `Tư vấn: ${courseTitle}` : 'Gửi tin nhắn'}
        </h3>
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
              placeholder={courseTitle ? `Tôi muốn được tư vấn về khóa học ${courseTitle}...` : "Lời nhắn của bạn..."}
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
            <>Gửi yêu cầu ngay <Send className="ml-2 w-5 h-5" /></>
          )}
        </Button>
      </form>
    </CardContent>
  )
}
