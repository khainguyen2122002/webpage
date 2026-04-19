import { createClient } from '@/utils/supabase/server'
import { CenterForm } from '@/components/admin/center-form'

export const dynamic = 'force-dynamic'

export default async function AdminCenterPage() {
  const supabase = await createClient()
  
  const { data: centerInfo } = await supabase
    .from('center_info')
    .select('*')
    .eq('id', '00000000-0000-0000-0000-000000000000')
    .single()

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Thông tin trung tâm</h1>
        <p className="text-slate-500">Cấu hình các thông tin cơ bản của trung tâm hiển thị trên website.</p>
      </div>

      <CenterForm initialData={centerInfo} />
    </div>
  )
}
