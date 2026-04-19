import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Về chúng tôi | EduCenter',
  description: 'Tìm hiểu về sứ mệnh, tầm nhìn và đội ngũ giảng viên tại EduCenter. Chúng tôi cam kết mang lại giá trị đào tạo thực chất.',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
