'use client'

import { useTransition } from 'react'
import { deleteContact } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DeleteContactButtonProps {
  contactId: string
}

export function DeleteContactButton({ contactId }: DeleteContactButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteContact(contactId)
      if (result.success) {
        toast.success('Đã xóa yêu cầu')
      } else {
        toast.error('Lỗi: ' + result.error)
      }
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          disabled={isPending}
          className="w-full justify-start gap-3 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Xóa bản ghi này
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Xác nhận xóa?</DialogTitle>
          <DialogDescription className="text-slate-500 mt-2">
            Hành động này không thể hoàn tác. Dữ liệu của học viên này sẽ bị xóa vĩnh viễn khỏi hệ thống của bạn.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-xl flex-grow">Hủy bỏ</Button>
          </DialogClose>
          <Button 
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-xl bg-red-500 hover:bg-red-600 flex-grow"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Vẫn xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

