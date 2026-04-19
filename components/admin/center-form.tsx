'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Save, Building, MapPin, Phone, Mail, Globe, Loader2, Image as ImageIcon, Facebook, MessageCircle, Sparkles, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { CenterInfo } from "@/types"
import { updateCenterInfo } from "@/app/actions"
import { useState } from "react"
import Image from "next/image"

const formSchema = z.object({
  name: z.string().min(2, "Tên trung tâm quá ngắn"),
  slogan: z.string().optional(),
  description: z.string().min(10, "Mô tả cần chi tiết hơn"),
  address: z.string().min(5, "Địa chỉ không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  zaloUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  mapUrl: z.string().url("Link bản đồ không hợp lệ").optional().or(z.literal('')),
  statsCourses: z.coerce.number().min(0),
  statsStudents: z.coerce.number().min(0),
  statsRating: z.coerce.number().min(0).max(5),
  showStats: z.boolean(),
  heroBadgeText: z.string().min(2, "Badge quá ngắn"),
  ctaPrimaryText: z.string().min(2, "Text quá ngắn"),
  ctaSecondaryText: z.string().min(2, "Text quá ngắn"),
  ctaSecondaryUrl: z.string().min(1, "Link không hợp lệ"),
  communityTitle: z.string().min(2, "Tiêu đề quá ngắn"),
  communityText: z.string().min(5, "Mô tả quá ngắn"),
  internationalTitle: z.string().min(2, "Tiêu đề quá ngắn"),
  internationalText: z.string().min(5, "Mô tả quá ngắn"),
})

export function CenterForm({ initialData }: { initialData: CenterInfo | null }) {
  const [loading, setLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo_url || null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(initialData?.banner_url || null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: (initialData?.name as string) || "",
      slogan: (initialData?.slogan as string) || "",
      description: (initialData?.description as string) || "",
      address: (initialData?.address as string) || "",
      phone: (initialData?.phone as string) || "",
      email: (initialData?.email as string) || "",
      zaloUrl: (initialData?.zalo_url as string) || "",
      facebookUrl: (initialData?.facebook_url as string) || "",
      mapUrl: (initialData?.map_url as string) || "",
      statsCourses: Number(initialData?.stats_courses ?? 50),
      statsStudents: Number(initialData?.stats_students ?? 12000),
      statsRating: Number(initialData?.stats_rating ?? 4.9),
      showStats: Boolean(initialData?.show_stats ?? false),
      heroBadgeText: initialData?.hero_badge_text || "Chào mừng bạn đến với EduCenter",
      ctaPrimaryText: initialData?.cta_primary_text || "Khám phá khóa học",
      ctaSecondaryText: initialData?.cta_secondary_text || "Tư vấn ngay",
      ctaSecondaryUrl: initialData?.cta_secondary_url || "/contact",
      communityTitle: initialData?.community_title || "Cộng đồng",
      communityText: initialData?.community_text || "Gia nhập cộng đồng HR hơn 12,000 học viên đã thành công.",
      internationalTitle: initialData?.international_title || "Tiêu chuẩn quốc tế",
      internationalText: initialData?.international_text || "Chương trình đào tạo chuẩn quốc tế với đội ngũ chuyên gia.",
    } as z.infer<typeof formSchema>,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === 'logo') {
        setLogoFile(file)
        setLogoPreview(URL.createObjectURL(file))
      } else {
        setBannerFile(file)
        setBannerPreview(URL.createObjectURL(file))
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })
      
      if (logoFile) formData.append('logoFile', logoFile)
      if (bannerFile) formData.append('bannerFile', bannerFile)
      if (initialData?.logo_url) formData.append('logoUrl', initialData.logo_url)
      if (initialData?.banner_url) formData.append('bannerUrl', initialData.banner_url)
      
      const result = await updateCenterInfo(formData)
      if (result?.error) throw new Error(result.error)
      toast.success("Đã cập nhật thông tin trung tâm thành công!")
    } catch (error: any) {
      toast.error("Lỗi khi cập nhật: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <Tabs defaultValue="general" className="w-full">
            <CardHeader className="p-0 border-b">
              <div className="p-10 bg-primary text-white space-y-2">
                <CardTitle className="text-2xl font-bold">Quản lý Thông tin Trung tâm</CardTitle>
                <CardDescription className="text-white/60">Cấu hình các thông tin hiển thị trên toàn bộ hệ thống.</CardDescription>
              </div>
              <TabsList className="w-full justify-start rounded-none h-14 bg-transparent px-10 gap-8">
                <TabsTrigger value="general" className="relative h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent px-0 font-bold text-slate-500 data-[state=active]:text-primary transition-all">
                  Thông tin chung
                </TabsTrigger>
                <TabsTrigger value="social" className="relative h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent px-0 font-bold text-slate-500 data-[state=active]:text-primary transition-all">
                  Liên hệ & Mạng xã hội
                </TabsTrigger>
                <TabsTrigger value="media" className="relative h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent px-0 font-bold text-slate-500 data-[state=active]:text-primary transition-all">
                  Hình ảnh (Logo/Banner)
                </TabsTrigger>
                <TabsTrigger value="stats" className="relative h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent px-0 font-bold text-slate-500 data-[state=active]:text-primary transition-all">
                  Hero & Thống kê
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent className="p-10">
              <TabsContent value="general" className="mt-0 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Building className="w-4 h-4 text-secondary" /> Tên trung tâm
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Tên trung tâm..." {...field} className="h-12 rounded-xl focus:ring-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slogan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-secondary" /> Slogan
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Câu khẩu hiệu..." {...field} className="h-12 rounded-xl focus:ring-primary" />
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
                      <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Giới thiệu ngắn (Metadata/Footer)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Mô tả tóm tắt về trung tâm..." 
                          {...field} 
                          className="min-h-[120px] rounded-2xl focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-secondary" /> Địa chỉ chi tiết
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Số nhà, tên đường, quận/huyện..." {...field} className="h-12 rounded-xl focus:ring-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="social" className="mt-0 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Phone className="w-4 h-4 text-secondary" /> Số điện thoại
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="09xx..." {...field} className="h-12 rounded-xl focus:ring-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Mail className="w-4 h-4 text-secondary" /> Email công vụ
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="admin@educenter.vn" {...field} className="h-12 rounded-xl focus:ring-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zaloUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-secondary" /> Link Zalo / Số Zalo
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://zalo.me/..." {...field} className="h-12 rounded-xl focus:ring-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="facebookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Facebook className="w-4 h-4 text-secondary" /> Link Facebook Fanpage
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://facebook.com/..." {...field} className="h-12 rounded-xl focus:ring-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="mapUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Globe className="w-4 h-4 text-secondary" /> Link Google Maps
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://goo.gl/maps/..." {...field} className="h-12 rounded-xl focus:ring-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="media" className="mt-0 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-secondary" /> Logo trung tâm
                    </label>
                    <div className="relative aspect-square w-40 rounded-3xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center group">
                      {logoPreview ? (
                        <Image src={logoPreview} alt="Logo preview" fill className="object-contain p-4" />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-slate-200" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, 'logo')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-slate-400">Khuyên dùng: Ảnh vuông, nền trong suốt (PNG).</p>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-secondary" /> Banner mặc định
                    </label>
                    <div className="relative aspect-video w-full rounded-3xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center group">
                      {bannerPreview ? (
                        <Image src={bannerPreview} alt="Banner preview" fill className="object-cover" />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-slate-200" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, 'banner')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-slate-400">Khuyên dùng: Kích thước 1920x1080 (16:9).</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="mt-0 space-y-12">
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800">Hiển thị số liệu thống kê</h4>
                    <p className="text-sm text-slate-500">Bật/tắt dải thống kê (Học viên, Khóa học, Đánh giá) trên trang chủ.</p>
                  </div>
                  <FormField
                    control={form.control}
                    name="showStats"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-8">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-secondary" /> Cấu hình Hero Banner
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="heroBadgeText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest">Badge (Nhãn nhỏ trên cùng)</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12 rounded-xl focus:ring-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ctaPrimaryText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nút chính (Orange)</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12 rounded-xl focus:ring-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ctaSecondaryText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nút phụ (Transparent)</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12 rounded-xl focus:ring-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ctaSecondaryUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest">Link nút phụ</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12 rounded-xl focus:ring-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-secondary" /> Số liệu Thống kê
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FormField
                      control={form.control}
                      name="statsStudents"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest">Số lượng học viên</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="h-12 rounded-xl focus:ring-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="statsCourses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest">Số lượng khóa học</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="h-12 rounded-xl focus:ring-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="statsRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest">Điểm đánh giá (1-5)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} className="h-12 rounded-xl focus:ring-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-secondary" /> Khối thông tin bổ sung
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="communityTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tiêu đề Cộng đồng</FormLabel>
                            <FormControl>
                              <Input {...field} className="h-12 rounded-xl focus:ring-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="communityText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mô tả Cộng đồng</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="min-h-[100px] rounded-xl focus:ring-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="internationalTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tiêu đề Quốc tế</FormLabel>
                            <FormControl>
                              <Input {...field} className="h-12 rounded-xl focus:ring-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="internationalText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mô tả Quốc tế</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="min-h-[100px] rounded-xl focus:ring-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <div className="pt-10 mt-10 border-t flex justify-end">
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-xl h-14 px-12 font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-95" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Save className="w-6 h-6 mr-2" />} 
                  Lưu thay đổi hệ thống
                </Button>
              </div>
            </CardContent>
          </Tabs>
        </Card>
      </form>
    </Form>
  )
}
