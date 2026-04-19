import { createClient } from '@/utils/supabase/server'
import { getContacts } from '@/app/actions'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  Trash2, 
  ExternalLink,
  PhoneCall,
  User,
  Clock
} from 'lucide-react'
import { ContactStatusToggle } from '@/components/admin/contact-status-toggle'
import { DeleteContactButton } from '@/components/admin/delete-contact-button'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function AdminContactsPage() {
  const result = await getContacts()
  const contacts = result.data || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Quản lý yêu cầu tư vấn</h1>
        <p className="text-slate-500">Danh sách học viên để lại thông tin liên hệ và yêu cầu tư vấn khóa học.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {contacts.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-200 shadow-none bg-slate-50/50">
            <CardContent className="flex flex-col items-center justify-center p-20 text-center space-y-4">
              <div className="bg-white p-4 rounded-full shadow-sm">
                <MessageSquare className="w-10 h-10 text-slate-300" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-600 uppercase tracking-widest text-xs">Hiện tại chưa có yêu cầu nào</p>
                <p className="text-sm text-slate-400">Các yêu cầu từ trang Liên hệ sẽ xuất hiện tại đây.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          contacts.map((contact) => (
            <Card key={contact.id} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all bg-white">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Info Section */}
                  <div className="flex-grow p-8 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-slate-800">{contact.name}</h3>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                             <Clock className="w-3 link-3" /> 
                             {format(new Date(contact.created_at), 'HH:mm - dd/MM/yyyy', { locale: vi })}
                          </div>
                        </div>
                      </div>
                      <Badge className={
                        contact.status === 'new' ? 'bg-blue-100 text-blue-600 border-none' : 
                        contact.status === 'contacted' ? 'bg-amber-100 text-amber-600 border-none' : 
                        'bg-green-100 text-green-600 border-none'
                      }>
                        {contact.status === 'new' ? 'Mới' : 
                         contact.status === 'contacted' ? 'Đang xử lý' : 'Hoàn thành'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="font-mono text-slate-700">{contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700 text-sm truncate">{contact.email || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-dashed border-slate-200">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nội dung tin nhắn:</p>
                       <p className="text-slate-600 leading-relaxed italic">"{contact.message}"</p>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="lg:w-72 bg-slate-50/80 border-l border-slate-100 p-8 flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hành động nhanh</p>
                      
                      {/* Zalo Link */}
                      <Button asChild variant="outline" className="w-full justify-start gap-3 rounded-xl hover:bg-[#0068ff] hover:text-white hover:border-transparent group">
                        <a href={`https://zalo.me/${contact.phone.replace(/[\s.-]/g, '')}`} target="_blank" rel="noopener noreferrer">
                          <MessageSquare className="w-4 h-4 text-blue-500 group-hover:text-white" />
                          Nhắn Zalo ngay
                        </a>
                      </Button>

                      {/* Phone Call Link */}
                      <Button asChild variant="outline" className="w-full justify-start gap-3 rounded-xl hover:bg-green-600 hover:text-white hover:border-transparent group">
                        <a href={`tel:${contact.phone.replace(/[\s.-]/g, '')}`}>
                          <PhoneCall className="w-4 h-4 text-green-500 group-hover:text-white" />
                          Gọi điện ngay
                        </a>
                      </Button>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-slate-200">
                      <ContactStatusToggle contactId={contact.id} currentStatus={contact.status} />
                      <DeleteContactButton contactId={contact.id} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
