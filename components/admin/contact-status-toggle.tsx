'use client'

import { useState, useTransition } from 'react'
import { updateContactStatus } from '@/app/actions'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ContactStatusToggleProps {
  contactId: string
  currentStatus: 'new' | 'contacted' | 'resolved'
}

export function ContactStatusToggle({ contactId, currentStatus }: ContactStatusToggleProps) {
  const [isPending, startTransition] = useTransition()

  function handleStatusChange(newStatus: string) {
    startTransition(async () => {
      const result = await updateContactStatus(contactId, newStatus as any)
      if (result.success) {
        toast.success('Đã cập nhật trạng thái')
      } else {
        toast.error('Lỗi: ' + result.error)
      }
    })
  }

  return (
    <div className="relative">
      <Select
        defaultValue={currentStatus}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-full rounded-xl bg-white border-slate-200 h-11">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : <SelectValue placeholder="Trạng thái" />}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">Mới</SelectItem>
          <SelectItem value="contacted">Đang xử lý</SelectItem>
          <SelectItem value="resolved">Hoàn thành</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
