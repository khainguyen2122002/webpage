import Link from 'next/link'
import Image from 'next/image'
import { GraduationCap, Facebook, Youtube, Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export async function Footer() {
  const supabase = await createClient()
  
  const { data: centerInfo } = await supabase
    .from('center_info')
    .select('*')
    .eq('id', '00000000-0000-0000-0000-000000000000')
    .single()

  const year = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground border-t border-white/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              {centerInfo?.logo_url ? (
                <div className="w-10 h-10 relative rounded-xl overflow-hidden bg-white flex-shrink-0 flex items-center justify-center">
                  <img
                    src={centerInfo.logo_url}
                    alt={centerInfo?.name || 'Logo'}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).parentElement!.innerHTML = '<div class="bg-white p-2 rounded-xl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary w-6 h-6"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>';
                    }}
                  />
                </div>
              ) : (
                <div className="bg-white p-2 rounded-xl">
                  <GraduationCap className="text-primary w-6 h-6" />
                </div>
              )}
              <span className="font-bold text-xl tracking-tight text-white uppercase">
                {centerInfo?.name || 'EDUCENTER'}
              </span>
            </Link>
            <p className="text-secondary-foreground/80 text-sm leading-relaxed">
              {centerInfo?.description || 'Kiến tạo tương lai thông qua giáo dục hiện đại và định hướng nghề nghiệp chuyên sâu.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-secondary font-bold mb-6 uppercase text-xs tracking-widest">Khám Phá</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link href="/courses" className="hover:text-secondary transition-colors font-medium">Tất cả khóa học</Link></li>
              <li><Link href="/about" className="hover:text-secondary transition-colors font-medium">Về chúng tôi</Link></li>
              <li><Link href="/contact" className="hover:text-secondary transition-colors font-medium">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-secondary font-bold mb-6 uppercase text-xs tracking-widest">Thông Tin</h3>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                <span>{centerInfo?.address || 'Vietnam'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span>{centerInfo?.phone || '0123 456 789'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span>{centerInfo?.email || 'contact@educenter.vn'}</span>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-secondary font-bold mb-6 uppercase text-xs tracking-widest">Kết Nối</h3>
            <div className="flex flex-wrap gap-3">
              {centerInfo?.facebook_url && (
                <a 
                  href={centerInfo.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 p-3 rounded-xl hover:bg-secondary transition-all hover:scale-110 group"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5 text-white group-hover:text-white" />
                </a>
              )}
              {centerInfo?.zalo_url && (
                <a 
                  href={centerInfo.zalo_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 p-3 rounded-xl hover:bg-secondary transition-all hover:scale-110 group"
                  title="Zalo"
                >
                  <MessageCircle className="w-5 h-5 text-white group-hover:text-white" />
                </a>
              )}
              <a href="#" className="bg-white/10 p-3 rounded-xl hover:bg-secondary transition-all hover:scale-110 group">
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
            <p className="mt-8 text-xs text-primary-foreground/40 font-medium">
              © {year} {centerInfo?.name || 'EduCenter'}. Toàn bộ bản quyền thuộc về chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
