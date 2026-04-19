export type CenterInfo = {
  id: string
  name: string
  slogan: string | null
  description: string
  address: string
  phone: string
  email: string
  zalo_url: string | null
  facebook_url: string | null
  logo_url: string | null
  banner_url: string | null
  map_url: string | null
  stats_courses: number
  stats_students: number
  stats_rating: number
  show_stats: boolean
  hero_badge_text: string
  cta_primary_text: string
  cta_secondary_text: string
  cta_secondary_url: string
  community_title: string
  community_text: string
  international_title: string
  international_text: string
  updated_at: string
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string
  content: {
    overview: string
    curriculum: Array<{
      title: string
      lessons: string[]
    }>
  }
  price: number
  original_price?: number
  discount_percent?: number
  instructor_name?: string
  instructor_role?: string
  learning_goals?: string
  target_audience?: string
  external_form_url?: string
  duration: string
  schedule: string
  level: string
  category: string
  image_url?: string
  is_featured: boolean
  created_at: string
  updated_at: string
}

export type Contact = {
  id: string
  name: string
  email: string | null
  phone: string
  message: string | null
  course_id: string | null
  type: 'contact' | 'consultation'
  status: 'new' | 'contacted' | 'resolved'
  created_at: string
}
