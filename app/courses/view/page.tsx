import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { CourseDetailView } from '@/components/course-detail-view'
import { Course, CenterInfo } from '@/types'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ id?: string; slug?: string }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { id, slug } = await searchParams
  const supabase = await createClient()
  
  const identifier = id || slug
  if (!identifier) return { title: 'EduCenter' }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)

  let query = supabase.from('courses').select('title, description')
  
  if (isUuid) {
    query = query.or(`id.eq.${identifier},slug.eq.${identifier}`)
  } else {
    query = query.eq('slug', identifier)
  }

  const { data: course } = await query.maybeSingle()

  if (!course) return { title: 'Không tìm thấy khóa học' }

  return {
    title: `${course.title} | EduCenter`,
    description: course.description
  }
}

export default async function ViewCoursePage({ searchParams }: PageProps) {
  const { id, slug } = await searchParams
  const supabase = await createClient()
  
  const identifier = id || slug
  if (!identifier) notFound()

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)

  try {
    let query = supabase.from('courses').select('*')
    
    if (isUuid) {
       query = query.or(`id.eq.${identifier},slug.eq.${identifier}`)
    } else {
       query = query.ilike('slug', identifier)
    }

    const { data: course, error: courseError } = await query.maybeSingle()

    if (courseError || !course) {
      console.error('[View Page] Course not found:', identifier)
      notFound()
    }

    const { data: center } = await supabase
      .from('center_info')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000000')
      .maybeSingle()

    return (
      <CourseDetailView 
        initialCourse={course as Course} 
        initialCenterInfo={center as CenterInfo} 
      />
    )
  } catch (error) {
    console.error('[View Page] Critical Error:', error)
    notFound()
  }
}
