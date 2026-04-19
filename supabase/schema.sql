-- 1. Table Definitions

-- Center Info Table (Only 1 row)
CREATE TABLE IF NOT EXISTS center_info (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000000',
  name TEXT NOT NULL,
  slogan TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  zalo_url TEXT,
  facebook_url TEXT,
  logo_url TEXT,
  banner_url TEXT,
  map_url TEXT,
  stats_courses INTEGER DEFAULT 50,
  stats_students INTEGER DEFAULT 12000,
  stats_rating NUMERIC DEFAULT 4.9,
  show_stats BOOLEAN DEFAULT false,
  hero_badge_text TEXT DEFAULT 'Chào mừng bạn đến với EduCenter',
  cta_primary_text TEXT DEFAULT 'Khám phá khóa học',
  cta_secondary_text TEXT DEFAULT 'Tư vấn ngay',
  cta_secondary_url TEXT DEFAULT '/contact',
  community_title TEXT DEFAULT 'Cộng đồng',
  community_text TEXT DEFAULT 'Gia nhập cộng đồng HR hơn 12,000 học viên đã thành công.',
  international_title TEXT DEFAULT 'Tiêu chuẩn quốc tế',
  international_text TEXT DEFAULT 'Chương trình đào tạo chuẩn quốc tế với đội ngũ chuyên gia.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB DEFAULT '{"overview": "", "curriculum": []}'::jsonb,
  price DECIMAL DEFAULT 0,
  duration TEXT,
  schedule TEXT,
  level TEXT,
  category TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Contacts / Consultations Table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  message TEXT,
  course_id UUID REFERENCES courses(id),
  type TEXT DEFAULT 'contact', -- 'contact' or 'consultation'
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'resolved'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE center_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 3. Define Policies

-- Admin Email Check Function Helper (Optional but cleaner)
-- Using direct check in policies for simplicity as requested

-- center_info policies
CREATE POLICY "Public can view center_info" ON center_info FOR SELECT USING (true);
CREATE POLICY "Admin can update center_info" ON center_info FOR ALL 
USING (auth.jwt() ->> 'email' = 'khainguyen2122002@gmail.com');

-- courses policies
CREATE POLICY "Public can view courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Admin can manage courses" ON courses FOR ALL 
USING (auth.jwt() ->> 'email' = 'khainguyen2122002@gmail.com');

-- contacts policies
CREATE POLICY "Public can submit contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view and manage contacts" ON contacts FOR ALL 
USING (auth.jwt() ->> 'email' = 'khainguyen2122002@gmail.com');

-- 4. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE center_info;
ALTER PUBLICATION supabase_realtime ADD TABLE courses;
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;
