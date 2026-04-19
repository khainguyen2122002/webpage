'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Save, Loader2, Plus, Image as ImageIcon, Calendar, Layers, Hash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"
import { Course } from "@/types"
import { upsertCourse } from "@/app/actions"
import Image from "next/image"

const formSchema = z.object({
  title: z.string().min(2, "Tên khóa học quá ngắn"),
  slug: z.string().min(2, "Slug không hợp lệ"),
  description: z.string().min(10, "Mô tả cần chi tiết hơn"),
  price: z.coerce.number().min(0),
  duration: z.string().min(2),
  schedule: z.string().min(2, "Vui lòng nhập lịch học"),
  level: z.string().min(1, "Vui lòng chọn cấp độ"),
  category: z.string().min(2, "Nhập danh mục khóa học"),
  is_featured: z.boolean().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function CourseFormDialog({ 
  course, 
  trigger 
}: { 
  course?: Course, 
  trigger?: React.ReactNode 
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(course?.image_url || null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      title: course?.title || "",
      slug: course?.slug || "",
      description: course?.description || "",
      price: Number(course?.price || 0),
      duration: course?.duration || "",
      schedule: course?.schedule || "",
      level: course?.level || "Cơ bản",
      category: course?.category || "",
      is_featured: !!course?.is_featured,
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const formData = new FormData()
      if (course?.id) formData.append('id', course.id)
      
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })

      if (imageFile) formData.append('imageFile', imageFile)
      if (course?.image_url) formData.append('imageUrl', course.image_url)
      
      // Preserve content
      formData.append('content', JSON.stringify(course?.content || { overview: "", curriculum: [] }))

      const result = await upsertCourse(formData)
      if (result?.error) throw new Error(result.error)
      toast.success(course ? "Cập nhật thành công!" : "Tạo khóa học thành công!")
      setOpen(false)
    } catch (error: any) {
      toast.error("Lỗi: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        (trigger || (
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 rounded-xl">
            <Plus className="w-5 h-5" /> Thêm khóa học
          </Button>
        )) as any
      } />
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto rounded-3xl p-0 border-none shadow-2xl">
        <DialogHeader className="p-8 bg-primary text-white">
          <DialogTitle className="text-2xl font-bold">{course ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}</DialogTitle>
          <DialogDescription className="text-white/60">
            Nhập thông tin chi tiết về khóa học để học viên có cái nhìn tốt nhất.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-slate-400">Tên khóa học</FormLabel>
                    <FormControl>
                      <Input placeholder="Next.js Mastering..." {...field} className="h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-slate-400">Slug (Đường dẫn)</FormLabel>
                    <FormControl>
                      <Input placeholder="nextjs-mastering" {...field} className="h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-slate-400">Mô tả ngắn gọn</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tóm tắt về khóa học và lợi ích của nó..." 
                      {...field} 
                      className="min-h-[100px] rounded-2xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-slate-400">Học phí (VNĐ)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-slate-400">Thời lượng</FormLabel>
                    <FormControl>
                      <Input placeholder="12 tuần / 24 bổi" {...field} className="h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                       <Calendar className="w-3.5 h-3.5 text-secondary" /> Lịch học
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Thứ 2-4-6 (19:00 - 21:00)" {...field} className="h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5 text-secondary" /> Danh mục
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Lập trình, Marketing..." {...field} className="h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-secondary" /> Cấp độ
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Chọn cấp độ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                        <SelectItem value="Trung cấp">Trung cấp</SelectItem>
                        <SelectItem value="Nâng cao">Nâng cao</SelectItem>
                        <SelectItem value="Chuyên gia">Chuyên gia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-secondary" /> Hình ảnh khóa học
              </label>
              <div className="relative aspect-video w-full max-w-sm rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center group">
                {preview ? (
                  <Image src={preview} alt="Course preview" fill className="object-cover" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-slate-200" />
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-2xl border p-4 bg-slate-50/50">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-bold">Khóa học nổi bật 🔥</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Hiển thị ưu tiên tại Banner hoặc mục Nổi bật của trang chủ.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl h-12 px-6">Hủy bỏ</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 font-bold" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                Lưu khóa học
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
