'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { CenterInfo, Course } from '@/types'

const adminEmail = 'khainguyen2122002@gmail.com'

async function getAdminUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw new Error(`Lỗi xác thực: ${error.message}`)
  if (user?.email !== adminEmail) throw new Error('Thiếu quyền cập nhật (Yêu cầu tài khoản Admin)')
  return { supabase, user }
}

// STORAGE ACTIONS
async function uploadFile(file: File, path: string) {
  try {
    const { supabase } = await getAdminUser()
    
    // Kiểm tra bucket edu-storage
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    if (bucketError) throw new Error(`Lỗi hạ tầng storage: ${bucketError.message}`)
    if (!buckets?.find(b => b.name === 'edu-storage')) {
      throw new Error("Bucket 'edu-storage' không tồn tại. Vui lòng tạo trên Supabase Storage.")
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${path}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('edu-storage')
      .upload(filePath, file)

    if (uploadError) {
      if (uploadError.message.toLowerCase().includes('permission') || uploadError.message.toLowerCase().includes('rls')) {
         throw new Error('Lỗi quyền upload (RLS): Bucket storage chưa được mở quyền public write.')
      }
      throw new Error(`Upload lỗi: ${uploadError.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('edu-storage')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error: any) {
    console.error('Lỗi uploadFile:', error)
    throw error
  }
}

// AUTH ACTIONS
export async function signOut() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error: any) {
    console.error('Lỗi signOut:', error)
    return { error: error.message || 'Lỗi hệ thống khi đăng xuất' }
  }
}

// CENTER INFO ACTIONS
export async function updateCenterInfo(formData: FormData) {
  try {
    const { supabase } = await getAdminUser()

    let logoUrl = formData.get('logoUrl') as string
    let bannerUrl = formData.get('bannerUrl') as string

    // Handle Logo Upload
    const logoFile = formData.get('logoFile') as File
    if (logoFile && logoFile.size > 0) {
      logoUrl = await uploadFile(logoFile, 'center')
    }

    // Handle Banner Upload
    const bannerFile = formData.get('bannerFile') as File
    if (bannerFile && bannerFile.size > 0) {
      bannerUrl = await uploadFile(bannerFile, 'center')
    }

    // Kiểm tra cột bảng
    const updates = {
      name: formData.get('name') as string,
      slogan: formData.get('slogan') as string,
      description: formData.get('description') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      zalo_url: formData.get('zaloUrl') as string,
      facebook_url: formData.get('facebookUrl') as string,
      logo_url: logoUrl,
      banner_url: bannerUrl,
      map_url: formData.get('mapUrl') as string,
      stats_courses: Number(formData.get('statsCourses') || 50),
      stats_students: Number(formData.get('statsStudents') || 12000),
      stats_rating: Number(formData.get('statsRating') || 4.9),
      show_stats: formData.get('showStats') === 'true',
      hero_badge_text: formData.get('heroBadgeText') as string,
      cta_primary_text: formData.get('ctaPrimaryText') as string,
      cta_secondary_text: formData.get('ctaSecondaryText') as string,
      cta_secondary_url: formData.get('ctaSecondaryUrl') as string,
      community_title: formData.get('communityTitle') as string,
      community_text: formData.get('communityText') as string,
      international_title: formData.get('internationalTitle') as string,
      international_text: formData.get('internationalText') as string,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('center_info')
      .upsert({ id: '00000000-0000-0000-0000-000000000000', ...updates })

    if (error) {
      if (error.code === '42P01') throw new Error('Không tìm thấy bảng center_info. Hãy chạy SQL schema.')
      if (error.code === '42703') throw new Error('Cột dữ liệu bị thiếu trong bảng center_info.')
      if (error.code === '42501') throw new Error('Thiệt lập RLS trong db chặn bạn cập nhật (Chưa có Policy Update).')
      throw new Error(`Cập nhật db thất bại: ${error.message}`)
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error: any) {
    console.error('[Action Error] updateCenterInfo:', error)
    return { error: error.message || 'Lỗi không xác định khi cập nhật.' }
  }
}

// COURSE ACTIONS
export async function upsertCourse(formData: FormData) {
  try {
    const { supabase } = await getAdminUser()

    let imageUrl = formData.get('imageUrl') as string
    const imageFile = formData.get('imageFile') as File
    
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFile(imageFile, 'courses')
    }

    const id = formData.get('id') as string
    const courseData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      duration: formData.get('duration') as string,
      schedule: formData.get('schedule') as string,
      level: formData.get('level') as string,
      category: formData.get('category') as string,
      is_featured: formData.get('isFeatured') === 'true',
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
      content: JSON.parse(formData.get('content') as string || '{"overview":"","curriculum":[]}')
    }

    const { data, error } = await supabase
      .from('courses')
      .upsert(id ? { id, ...courseData } : courseData)
      .select()

    if (error) {
      if (error.code === '42P01') throw new Error('Không tìm thấy bảng courses.')
      throw new Error(`Cập nhật khóa học lỗi: ${error.message}`)
    }

    revalidatePath('/', 'layout')
    return { success: true, data }
  } catch (error: any) {
    console.error('[Action Error] upsertCourse:', error)
    return { error: error.message || 'Lỗi không xác định khi lưu khóa học.' }
  }
}

export async function deleteCourse(id: string) {
  try {
    const { supabase } = await getAdminUser()

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Xóa thất bại: ${error.message}`)

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error: any) {
    console.error('[Action Error] deleteCourse:', error)
    return { error: error.message || 'Lỗi khi xóa khóa học.' }
  }
}

// CONTACT ACTIONS
export async function submitContact(formData: FormData) {
  try {
    const supabase = await createClient()

    const contactData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
      course_id: formData.get('courseId') as string || null,
      type: formData.get('type') as string || 'contact',
    }

    const { error } = await supabase
      .from('contacts')
      .insert([contactData])

    if (error) {
       if (error.code === '42P01') throw new Error('Không tìm thấy bảng contacts (chưa tạo db).')
       throw new Error(`Đã có lỗi CSDL: ${error.message}`)
    }

    return { success: true }
  } catch (error: any) {
    console.error('[Action Error] submitContact:', error)
    return { error: error.message || 'Không thể gửi thông tin liên hệ.' }
  }
}

// SEED DATA
export async function seedSampleData() {
  try {
    const { supabase } = await getAdminUser()

    // 1. Seed Center Info
    const centerInfo = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Inspiring HR',
      slogan: 'Nâng tầm giá trị nguồn nhân lực Việt',
      description: 'Chúng tôi là đơn vị đi đầu trong việc đào tạo và tư vấn giải pháp nhân sự toàn diện, giúp doanh nghiệp tối ưu hóa nguồn lực và xây dựng đội ngũ vững mạnh.',
      address: 'Số 45, Đường Võ Văn Kiệt, Quận 1, TP. Hồ Chí Minh',
      phone: '0901 234 567',
      email: 'hello@inspiringhr.vn',
      zalo_url: 'https://zalo.me/your-id',
      facebook_url: 'https://facebook.com/inspiringhr',
      logo_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
      banner_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
      updated_at: new Date().toISOString()
    }

    const { error: cntrErr } = await supabase.from('center_info').upsert(centerInfo)
    if (cntrErr) throw new Error(`Lỗi seed center_info: ${cntrErr.message}`)

    // 2. Seed 8 HR Courses
    const hrCourses = [
      {
        title: 'Quản trị Nhân sự Hiện đại (HR Generalist)',
        slug: 'quan-tri-nhan-su-hien-dai',
        description: 'Lộ trình từ A-Z dành cho người mới hoặc muốn hệ thống lại kiến thức quản trị nhân sự tổng thể trong kỷ nguyên số.',
        price: 4500000,
        duration: '12 buổi',
        schedule: 'Tối Thứ 2-4-6',
        level: 'Cơ bản',
        category: 'Quản trị',
        is_featured: true,
        image_url: 'https://images.unsplash.com/photo-1521791136364-798a7bc0d262?q=80&w=2069&auto=format&fit=crop',
        content: {
          overview: 'Học viên sẽ được trang bị tư duy quản trị mới nhất, các quy trình nhân sự chuẩn mực từ thu hút đến giữ chân nhân tài.',
          curriculum: [
            { title: 'Chương 1: Tư duy HR 4.0', lessons: ['Vai trò của HR trong doanh nghiệp', 'HR Business Partner là gì?'] },
            { title: 'Chương 2: Quy trình Tuyển dụng', lessons: ['Xây dựng JD', 'Kỹ năng phỏng vấn theo hành vi'] }
          ]
        }
      },
      {
        title: 'Chuyên gia Tuyển dụng & Thu hút Tài năng',
        slug: 'tuyen-dung-va-thu-hut-tai-nang',
        description: 'Nâng cao kỹ năng săn đầu người (Headhunt) và xây dựng thương hiệu tuyển dụng (Employer Branding) chuyên nghiệp.',
        price: 3800000,
        duration: '8 buổi',
        schedule: 'Sáng Thứ 7 & CN',
        level: 'Trung cấp',
        category: 'Tuyển dụng',
        is_featured: true,
        image_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop',
        content: {
          overview: 'Khóa học tập trung vào các kỹ thuật sourcing, phỏng vấn và đánh giá ứng viên hiệu quả.',
          curriculum: [
            { title: 'Chương 1: Kỹ thuật Sourcing', lessons: ['Khai thác LinkedIn', 'Facebook Recruiting'] },
            { title: 'Chương 2: Đánh giá nhân sự', lessons: ['Phương pháp STAR', 'DISC trong tuyển dụng'] }
          ]
        }
      },
      {
        title: 'C&B Toàn diện từ Cơ bản đến Nâng cao',
        slug: 'cb-toan-dien',
        description: 'Làm chủ bảng lương, bảo hiểm, thuế TNCN và các chính sách đãi ngộ phức tạp nhất trong doanh nghiệp.',
        price: 5500000,
        duration: '15 buổi',
        schedule: 'Tối Thứ 3-5',
        level: 'Nâng cao',
        category: 'C&B',
        is_featured: true,
        image_url: 'https://images.unsplash.com/photo-1454165833767-027eeea15539?q=80&w=2070&auto=format&fit=crop',
        content: {
          overview: 'Khóa học cung cấp kiến thức thực chiến về xử lý bảng lương trên Excel và phần mềm HRIS.',
          curriculum: [
            { title: 'Chương 1: Luật Lao động ứng dụng', lessons: ['Hợp đồng lao động', 'Xử lý kỷ luật'] },
            { title: 'Chương 2: Hệ thống Lương', lessons: ['Thiết lập thang bảng lương', 'Tính thuế TNCN'] }
          ]
        }
      },
      {
        title: 'Đào tạo & Phát triển Nguồn nhân lực (L&D)',
        slug: 'dao-tao-va-phat-trien-ld',
        description: 'Xây dựng bản đồ đào tạo, đo lường ROI trong đào tạo và phát triển văn hóa học tập trong doanh nghiệp.',
        price: 4200000,
        duration: '10 buổi',
        schedule: 'Chiều Thứ 7',
        level: 'Trung cấp',
        category: 'Đào tạo',
        is_featured: false,
        image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
        content: {
          overview: 'Học cách thiết kế chương trình đào tạo nội bộ hấp dẫn và mang lại hiệu quả thực chất.',
          curriculum: [
            { title: 'Chương 1: Phân tích nhu cầu đào tạo (TNA)', lessons: ['Công cụ phân tích', 'Xác định mục tiêu'] },
            { title: 'Chương 2: Đo lường hiệu quả', lessons: ['Mô hình Kirkpatrick', 'ROI trong đào tạo'] }
          ]
        }
      },
      {
        title: 'Xây dựng Văn hóa Doanh nghiệp HP',
        slug: 'xay-dung-van-hoa-doanh-nghiep',
        description: 'Làm thế nào để văn hóa trở thành lợi thế cạnh tranh cốt lõi của doanh nghiệp và gắn kết nhân viên.',
        price: 3500000,
        duration: '6 buổi',
        schedule: 'Tối Thứ 6',
        level: 'Nâng cao',
        category: 'Văn hóa',
        is_featured: false,
        image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
        content: {
          overview: 'Tìm hiểu về các tầng văn hóa và cách thức triển khai văn hóa xuống từng cấp nhân viên.',
          curriculum: [
            { title: 'Chương 1: Định nghĩa văn hóa', lessons: ['Cốt lõi văn hóa', 'Truyền thông nội bộ'] },
            { title: 'Chương 2: Gắn kết nhân viên', lessons: ['Employee Engagement', 'Khảo sát văn hóa'] }
          ]
        }
      },
      {
        title: 'HR Analytics: Phân tích Dữ liệu Nhân sự',
        slug: 'hr-analytics-du-lieu-nhan-su',
        description: 'Chuyển đổi từ dữ liệu thô sang các báo cáo nhân sự thông minh giúp Ban lãnh đạo ra quyết định chính xác.',
        price: 6000000,
        duration: '10 buổi',
        schedule: 'Tối Thứ 2-4',
        level: 'Chuyên gia',
        category: 'Dữ liệu',
        is_featured: false,
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop',
        content: {
          overview: 'Làm chủ PowerBI và Excel để tối ưu hóa báo cáo biến động nhân sự, hiệu suất và chi phí.',
          curriculum: [
            { title: 'Chương 1: Các chỉ số nhân sự (Metrics)', lessons: ['Turnover rate', 'Revenue per employee'] },
            { title: 'Chương 2: Trực quan hóa dữ liệu', lessons: ['Thiết kế Dashboard nhân sự', 'PowerBI cơ bản'] }
          ]
        }
      },
      {
        title: 'Luật Lao động & Quan hệ Lao động',
        slug: 'luat-lao-dong-quan-he-lao-dong',
        description: 'Tránh các rủi ro pháp lý thường gặp và xây dựng quan hệ lao động hài hòa, bền vững.',
        price: 3200000,
        duration: '6 buổi',
        schedule: 'Sáng Thứ 7',
        level: 'Cơ bản',
        category: 'Pháp lý',
        is_featured: false,
        image_url: 'https://images.unsplash.com/photo-1589829545856-110557e00fb3?q=80&w=2070&auto=format&fit=crop',
        content: {
          overview: 'Cập nhật các điểm mới nhất trong Bộ luật Lao động 2019 và các nghị định hướng dẫn.',
          curriculum: [
            { title: 'Chương 1: Hợp đồng & Chấm dứt', lessons: ['Hợp đồng thử việc', 'Đơn phương chấm dứt'] },
            { title: 'Chương 2: Tranh chấp lao động', lessons: ['Hòa giải', 'Tòa án lao động'] }
          ]
        }
      },
      {
        title: 'Kỹ năng Phỏng vấn & Đánh giá Hành vi (BEI)',
        slug: 'ky-nang-phong-van-bei',
        description: 'Trở thành nhà tuyển dụng sắc sảo với kỹ thuật đặt câu hỏi xoáy vào hành vi thực tế của ứng viên.',
        price: 2500000,
        duration: '4 buổi',
        schedule: 'Tối Thứ 5',
        level: 'Trung cấp',
        category: 'Kỹ năng',
        is_featured: false,
        image_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop',
        content: {
          overview: 'Khóa học thực hành 100% với các tình huống phỏng vấn giả định khó nhất.',
          curriculum: [
            { title: 'Chương 1: Kỹ thuật BEI', lessons: ['Đặt câu hỏi tình huống', 'Xác minh thông tin'] },
            { title: 'Chương 2: Tâm lý học ứng viên', lessons: ['Đọc vị ngôn ngữ cơ thể', 'Vượt qua định kiến'] }
          ]
        }
      }
    ]

    for (const course of hrCourses) {
      const { error: seedCourseErr } = await supabase.from('courses').upsert(course, { onConflict: 'slug' })
      if (seedCourseErr) throw new Error(`Lỗi seed khoá học: ${seedCourseErr.message}`)
    }

    revalidatePath('/', 'layout')
    
    return { success: true }
  } catch (error: any) {
    console.error('[Action Error] seedSampleData:', error)
    return { error: error.message || 'Lỗi hệ thống khi tạo dữ liệu mẫu.' }
  }
}
