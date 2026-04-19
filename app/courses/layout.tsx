import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Danh sách Khóa học | EduCenter',
  description: 'Khám phá các khóa học chuẩn quốc tế từ cơ bản đến nâng cao tại EduCenter. Lập trình, thiết kế, marketing và nhiều hơn nữa.',
}

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
