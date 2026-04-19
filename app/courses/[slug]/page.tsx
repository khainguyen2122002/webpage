import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { CourseDetailView } from '@/components/course-detail-view'
import { Course, CenterInfo } from '@/types'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: course } = await supabase
    .from('courses')
    .select('title, description')
    .eq('slug', slug)
    .single()

  if (!course) return { title: 'Không tìm thấy khóa học' }

  return {
    title: `${course.title} | EduCenter`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
    }
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  let courseData = null
  let centerData = null

  try {
    // 1. Lấy dữ liệu khóa học (Sử dụng ilike để không phân biệt hoa thường)
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .ilike('slug', slug)
      .maybeSingle()

    if (courseError || !course) {
      console.error('[Course Page] Error fetching course:', courseError)
      notFound()
    }
    courseData = course

    // 2. Lấy dữ liệu trung tâm (Nếu lỗi thì vẫn hiện trang khóa học)
    try {
      const { data: center } = await supabase
        .from('center_info')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000000')
        .maybeSingle()
      centerData = center
    } catch (e) {
      console.warn('[Course Page] Center info not found, using defaults.')
    }

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: courseData.title,
      description: courseData.description,
      provider: {
        '@type': 'Organization',
        name: centerData?.name || 'EduCenter',
        sameAs: siteUrl
      },
      offers: {
        '@type': 'Offer',
        price: courseData.price,
        priceCurrency: 'VND'
      }
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CourseDetailView 
          initialCourse={courseData as Course} 
          initialCenterInfo={centerData as CenterInfo} 
        />
      </>
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_NOT_FOUND') {
      throw error // Re-throw Next.js notFound()
    }
    console.error('[Course Page] Critical Error:', error)
    notFound()
  }
}
