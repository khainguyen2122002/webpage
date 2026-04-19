'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Save, Loader2, Plus, Image as ImageIcon, Calendar, Layers, Hash, ArrowRight } from "lucide-react"

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

  // Tự động tạo slug từ tiêu đề (chỉ cho khóa học mới)
  const watchedTitle = form.watch("title")
  useEffect(() => {
    if (!course && watchedTitle) {
      const slug = watchedTitle
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
      
      form.setValue("slug", slug, { shouldValidate: true })
    }
  }, [watchedTitle, form, course])

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
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 rounded-xl shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" /> Thêm khóa học
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] lg:max-w-7xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-0 border-none shadow-2xl bg-slate-50 selection:bg-secondary/30">

        <DialogHeader className="p-8 md:p-12 bg-primary text-white sticky top-0 z-30 flex flex-row items-center justify-between overflow-hidden">
          <div className="relative z-10">
            <DialogTitle className="text-3xl md:text-4xl font-black tracking-tight">{course ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}</DialogTitle>
            <DialogDescription className="text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
               <Layers className="w-4 h-4 text-secondary" /> Hệ thống quản lý nội dung đào tạo chuyên sâu
            </DialogDescription>
          </div>
          <div className="absolute right-[-5%] top-[-20%] w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          <div className="hidden md:block relative z-10">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl" onClick={() => setOpen(false)}>Hủy bỏ</Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-12 space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* LEFT COLUMN: CORE INFO */}
              <div className="lg:col-span-2 space-y-12">
                
                {/* SECTION: CONTENT */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 space-y-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:scale-110" />
                  
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-8 bg-secondary rounded-full" />
                    <h4 className="font-black text-primary uppercase text-sm tracking-widest">Nội dung hiển thị</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tên khóa học chính thức</FormLabel>
                          <FormControl>
                            <Input placeholder="Ví dụ: Digital Marketing Pro..." {...field} className="h-16 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-xl font-bold text-primary" />
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
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider text-secondary">Đường dẫn thân thiện (Slug)</FormLabel>
                          <FormControl>
                            <div className="relative group/input">
                              <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-secondary transition-colors" />
                              <Input placeholder="khoa-hoc-marketing" {...field} className="h-16 pl-14 rounded-2xl bg-slate-50/50 border-slate-200 font-mono text-sm" />
                            </div>
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
                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Mô tả ngắn gọn (Thẻ Card)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Mô tả giá trị của khóa học trong 2-3 câu..." 
                            {...field} 
                            className="min-h-[140px] rounded-[2rem] bg-slate-50/50 border-slate-200 focus:bg-white p-6 leading-relaxed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* SECTION: TEAM & GOALS */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-8 bg-secondary rounded-full" />
                    <h4 className="font-black text-primary uppercase text-sm tracking-widest">Đội ngũ & Mục tiêu bài giảng</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="instructor_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Họ tên giảng viên</FormLabel>
                          <FormControl>
                            <Input placeholder="Ms. Tuyết Nhung" {...field as any} value={field.value || ''} className="h-14 rounded-2xl bg-slate-50/50 border-slate-100" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="instructor_role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Vị trí / Chuyên môn</FormLabel>
                          <FormControl>
                            <Input placeholder="HR Manager / Strategy Expert" {...field as any} value={field.value || ''} className="h-14 rounded-2xl bg-slate-50/50 border-slate-100" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="learning_goals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Mục tiêu đào tạo (Bullet points)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="- Thành thạo kỹ năng X&#10;- Nắm vững quy trình Y..." {...field as any} value={field.value || ''} className="min-h-[180px] rounded-[2rem] bg-slate-50/50 p-6" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="target_audience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Đối tượng học viên</FormLabel>
                          <FormControl>
                            <Textarea placeholder="- Sinh viên năm cuối&#10;- Người muốn nâng cấp kỹ năng..." {...field as any} value={field.value || ''} className="min-h-[180px] rounded-[2rem] bg-slate-50/50 p-6" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: PARAMETERS & MEDIA */}
              <div className="space-y-12">
                
                {/* PRICING CARD */}
                <div className="bg-primary p-10 rounded-[3rem] text-white shadow-2xl shadow-primary/30 space-y-8 relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-tl-full" />
                  
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-6 bg-secondary rounded-full" />
                    <h4 className="font-black uppercase text-[10px] tracking-widest text-white/80">Học phí & Ưu đãi</h4>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase text-white/50 tracking-wider">Giá khuyến mãi (Hiện tại)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="h-16 rounded-2xl bg-white/10 border-white/20 text-2xl font-black text-secondary focus:bg-white/20 transition-all" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="original_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-white/40 tracking-wider">Giá gốc</FormLabel>
                          <FormControl>
                            <Input type="number" {...field as any} value={field.value || ''} className="h-12 rounded-xl bg-white/5 border-white/10 text-center" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discount_percent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-secondary/60 tracking-wider">Giảm %</FormLabel>
                          <FormControl>
                            <Input type="number" {...field as any} value={field.value || ''} className="h-12 rounded-xl bg-secondary/10 border-secondary/20 text-secondary font-black text-center" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* DETAILS CARD */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-8 bg-secondary rounded-full" />
                    <h4 className="font-black text-primary uppercase text-[10px] tracking-widest">Tiêu chuẩn kỹ thuật</h4>
                  </div>

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Thời lượng đào tạo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ví dụ: 24 buổi / 3 tháng" {...field} className="h-14 rounded-2xl bg-slate-50/50 border-slate-100" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Trình độ chuyên môn</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 font-bold">
                              <SelectValue placeholder="Chọn cấp độ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                            {['Cơ bản', 'Trung cấp', 'Nâng cao', 'Chuyên gia'].map(l => (
                              <SelectItem key={l} value={l} className="rounded-xl font-bold py-3">{l}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-4 space-y-0 rounded-[2rem] border-2 border-dashed border-slate-100 p-6 bg-slate-50/30 hover:bg-white transition-all cursor-pointer group/featured">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="w-6 h-6 rounded-lg data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-xs font-black uppercase text-primary group-hover/featured:text-secondary transition-colors">🔥 Khóa học nổi bật</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* IMAGE CARD */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 space-y-6">
                   <div className="flex items-center gap-4">
                    <div className="w-2 h-8 bg-secondary rounded-full" />
                    <h4 className="font-black text-primary uppercase text-[10px] tracking-widest">Hình ảnh đại diện</h4>
                  </div>
                  <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center group hover:border-secondary/50 transition-all cursor-pointer">
                    {preview ? (
                      <Image src={preview} alt="Course preview" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto group-hover:bg-secondary/10 transition-colors">
                          <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-secondary transition-colors" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tải ảnh lên hệ thống</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* EXTERNAL LINK BOX */}
            <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden relative group">
               <div className="absolute right-0 top-0 h-full w-2 bg-secondary/20 group-hover:bg-secondary transition-all" />
               <FormField
                  control={form.control}
                  name="external_form_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase text-secondary tracking-[0.2em] mb-4 block">Liên kết đăng ký ngoài (Google Form / Sheet / Landing Page)</FormLabel>
                      <FormControl>
                        <div className="relative">
                           <ArrowRight className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
                           <Input placeholder="https://forms.gle/..." {...field as any} value={field.value || ''} className="h-16 pl-14 rounded-2xl bg-secondary/5 border-dashed border-secondary/30 focus:bg-white focus:border-secondary text-primary font-medium" />
                        </div>
                      </FormControl>
                      <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-wider italic">* Để trống nếu muốn học viên sử dụng Form mặc định của hệ thống.</p>
                    </FormItem>
                  )}
                />
            </div>

            {/* ACTION FOOTER */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-12 border-t-4 border-slate-50">
              <div className="flex items-start gap-4 max-w-md">
                 <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Save className="w-5 h-5 text-slate-400" />
                 </div>
                 <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase tracking-tighter">
                   Dữ liệu sẽ được đồng bộ ngay lập tức. Vui lòng kiểm tra lại Slug và Học phí trước khi xác nhận lưu.
                 </p>
              </div>
              <div className="flex gap-6 w-full md:w-auto">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="flex-1 md:flex-none rounded-2xl h-16 px-10 font-black text-slate-400 hover:text-primary transition-colors">Hủy bỏ</Button>
                <Button type="submit" className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-white rounded-[1.5rem] h-20 px-16 font-black text-xl shadow-[0_20px_40px_rgba(26,67,1,0.25)] hover:shadow-none transition-all active:scale-95" disabled={loading}>
                  {loading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <Save className="mr-3 h-6 w-6 text-secondary" />}
                  Xác nhận lưu khóa học
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
