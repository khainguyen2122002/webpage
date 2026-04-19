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

export type Course = {
  id: string
  slug: string
  title: string
  description: string
  content: {
    overview: string
    curriculum: {
      title: string
      lessons: string[]
    }[]
  }
  price: number
  duration: string
  schedule: string | null
  level: string | null
  image_url: string | null
  category: string
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
