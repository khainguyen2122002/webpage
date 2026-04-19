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
  price: z.coerce.number().min(0, "Giá khuyến mãi không được âm"),
  original_price: z.coerce.number().optional().nullable(),
  discount_percent: z.coerce.number().optional().nullable(),
  duration: z.string().min(2, "Vui lòng nhập thời lượng"),
  schedule: z.string().min(2, "Vui lòng nhập lịch học"),
  level: z.string().min(1, "Vui lòng chọn cấp độ"),
  category: z.string().min(2, "Nhập danh mục khóa học"),
  instructor_name: z.string().optional().nullable(),
  instructor_role: z.string().optional().nullable(),
  learning_goals: z.string().optional().nullable(),
  target_audience: z.string().optional().nullable(),
  external_form_url: z.string().optional().nullable(),
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
      original_price: course?.original_price ? Number(course?.original_price) : null,
      discount_percent: course?.discount_percent ? Number(course?.discount_percent) : null,
      duration: course?.duration || "",
      schedule: course?.schedule || "",
      level: course?.level || "Cơ bản",
      category: course?.category || "",
      instructor_name: course?.instructor_name || "",
      instructor_role: course?.instructor_role || "",
      learning_goals: course?.learning_goals || "",
      target_audience: course?.target_audience || "",
      external_form_url: course?.external_form_url || "",
      is_featured: !!course?.is_featured,
    },
  })

  // Sửa lỗi Edit: Cập nhật lại Form mỗi khi prop course thay đổi hoặc khi mở Dialog
  useEffect(() => {
    if (open) {
      form.reset({
        title: course?.title || "",
        slug: course?.slug || "",
        description: course?.description || "",
        price: Number(course?.price || 0),
        original_price: course?.original_price ? Number(course?.original_price) : null,
        discount_percent: course?.discount_percent ? Number(course?.discount_percent) : null,
        duration: course?.duration || "",
        schedule: course?.schedule || "",
        level: course?.level || "Cơ bản",
        category: course?.category || "",
        instructor_name: course?.instructor_name || "",
        instructor_role: course?.instructor_role || "",
        learning_goals: course?.learning_goals || "",
        target_audience: course?.target_audience || "",
        external_form_url: course?.external_form_url || "",
        is_featured: !!course?.is_featured,
      })
      setPreview(course?.image_url || null)
      setImageFile(null)
    }
  }, [course, open, form])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  async function onSubmit(values: FormValues) {
    setLoading(true)
    try {
      const formData = new FormData()
      if (course?.id) formData.append('id', course.id)
      
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString())
        }
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-none shadow-2xl">

        <DialogHeader className="p-8 bg-primary text-white sticky top-0 z-10">
          <DialogTitle className="text-2xl font-bold">{course ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}</DialogTitle>
          <DialogDescription className="text-white/60 text-xs font-medium uppercase tracking-widest mt-1">
             Cấu hình thông tin đào tạo chuyên sâu
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-12">
            
            {/* PHẦN 1: THÔNG TIN CƠ BẢN */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-1 bg-secondary rounded-full" />
                <h4 className="font-black text-primary uppercase text-sm tracking-widest">Thông tin cơ bản</h4>
              </div>
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
            </div>

            {/* PHẦN 2: HỌC PHÍ & ƯU ĐÃI */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-1 bg-secondary rounded-full" />
                <h4 className="font-black text-primary uppercase text-sm tracking-widest">Học phí & Ưu đãi</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-slate-400">Học phí khuyến mãi (VNĐ)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="h-12 rounded-xl border-secondary/30 bg-secondary/5" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="original_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-slate-400">Học phí gốc (VNĐ)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field as any} value={field.value || ''} className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount_percent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-slate-400 font-black text-red-500">% Giảm giá (Ví dụ: 30)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field as any} value={field.value || ''} placeholder="30" className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* PHẦN 3: ĐÀO TẠO & GIẢNG VIÊN */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-1 bg-secondary rounded-full" />
                <h4 className="font-black text-primary uppercase text-sm tracking-widest">Đào tạo & Giảng viên</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="instructor_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-slate-400">Tên giảng viên</FormLabel>
                      <FormControl>
                        <Input placeholder="Ms. Tuyết Nhung" {...field as any} value={field.value || ''} className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instructor_role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-slate-400">Chức vụ giảng viên</FormLabel>
                      <FormControl>
                        <Input placeholder="HR Manager / Expert Consultant" {...field as any} value={field.value || ''} className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>

            {/* PHẦN 4: MỤC TIÊU & ĐĂNG KÝ */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-1 bg-secondary rounded-full" />
                <h4 className="font-black text-primary uppercase text-sm tracking-widest">Mục tiêu & Đăng ký</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="learning_goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-slate-400">Mục tiêu khóa học</FormLabel>
                      <FormControl>
                        <Textarea placeholder="- Thành thạo kỹ năng...&#10;- Nắm vững quy trình..." {...field as any} value={field.value || ''} className="min-h-[120px] rounded-2xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="target_audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-slate-400">Đối tượng phù hợp</FormLabel>
                      <FormControl>
                        <Textarea placeholder="- Sinh viên năm cuối...&#10;- Người mới đi làm..." {...field as any} value={field.value || ''} className="min-h-[120px] rounded-2xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="external_form_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-secondary font-black">Link Form đăng ký ngoài (Google Form/Sheet)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://docs.google.com/forms/..." {...field as any} value={field.value || ''} className="h-12 rounded-xl border-dashed border-secondary/50" />
                    </FormControl>
                    <FormMessage />
                    <DialogDescription className="text-[11px]">
                       Để trống nếu bạn muốn học viên sử dụng Form liên hệ có sẵn trên trang web.
                    </DialogDescription>
                  </FormItem>
                )}
              />
            </div>

            {/* PHẦN 5: HÌNH ẢNH & KHÁC */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-1 bg-secondary rounded-full" />
                <h4 className="font-black text-primary uppercase text-sm tracking-widest">Hình ảnh & Cài đặt khác</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-secondary" /> Hình ảnh đại diện
                  </label>
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center group">
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

                <div className="space-y-6 pt-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase text-slate-400">Danh mục chính</FormLabel>
                        <FormControl>
                          <Input placeholder="Marketing / Sales / HR" {...field} className="h-12 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">Đẩy lên trang chủ</p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="flex justify-end gap-3 pt-8 border-t sticky bottom-0 bg-white z-10 pb-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl h-12 px-6">Hủy bỏ</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-xl h-14 px-10 font-black text-lg" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                Lưu toàn bộ thay đổi
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
