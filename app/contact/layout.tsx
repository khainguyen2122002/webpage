import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liên hệ | EduCenter',
  description: 'Liên hệ với EduCenter để được tư vấn về các khóa học và chương trình đào tạo. Chúng tôi luôn sẵn sàng hỗ trợ bạn.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
