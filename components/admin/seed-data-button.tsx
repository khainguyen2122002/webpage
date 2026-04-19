'use client'

import { useState } from 'react'
import { Database, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { seedSampleData } from '@/app/actions'
import { toast } from 'sonner'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'

export function SeedDataButton() {
  const [loading, setLoading] = useState(false)

  async function handleSeed() {
    if (!confirm('Bạn có chắc chắn muốn nạp dữ liệu mẫu? Việc này sẽ cập nhật thông tin trung tâm và thêm các khóa học nhân sự mẫu.')) return
    
    setLoading(true)
    try {
      const result = await seedSampleData()
      if (result?.error) throw new Error(result.error)
      toast.success('Đã nạp dữ liệu mẫu thành công! Hãy làm mới trang để thấy thay đổi.')
      window.location.reload()
    } catch (error: any) {
      toast.error('Lỗi khi seed dữ liệu: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Database className="w-5 h-5 text-secondary" /> Cấu hình hệ thống
        </CardTitle>
        <CardDescription>Các công cụ hỗ trợ thiết lập nhanh website.</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Button 
          onClick={handleSeed} 
          disabled={loading}
          className="w-full h-12 bg-slate-50 hover:bg-slate-100 text-primary font-bold border border-slate-200 rounded-xl transition-all"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
          )}
          Nạp dữ liệu mẫu (HR)
        </Button>
        <p className="text-[10px] text-slate-400 mt-4 text-center italic">
          *Dành cho việc demo và test hệ thống ban đầu.
        </p>
      </CardContent>
    </Card>
  )
}
