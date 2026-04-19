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
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createClient } from '@/utils/supabase/client'

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
  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
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
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>(initialData?.logo_url || '')
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string>(initialData?.banner_url || '')
  const [logoImgError, setLogoImgError] = useState(false)
  const [bannerImgError, setBannerImgError] = useState(false)
  const router = useRouter()

  const formValues = React.useMemo(() => {
    if (!initialData) return undefined;
    return {
      name: initialData.name || "",
      slogan: initialData.slogan || "",
      description: initialData.description || "",
      address: initialData.address || "",
      phone: initialData.phone || "",
      email: initialData.email || "",
      zaloUrl: initialData.zalo_url || "",
      facebookUrl: initialData.facebook_url || "",
      mapUrl: initialData.map_url || "",
      logoUrl: initialData.logo_url || "",
      bannerUrl: initialData.banner_url || "",
      statsCourses: Number(initialData.stats_courses ?? 50),
      statsStudents: Number(initialData.stats_students ?? 12000),
      statsRating: Number(initialData.stats_rating ?? 4.9),
      showStats: Boolean(initialData.show_stats ?? false),
      heroBadgeText: initialData.hero_badge_text || "Chào mừng bạn đến với EduCenter",
      ctaPrimaryText: initialData.cta_primary_text || "Khám phá khóa học",
      ctaSecondaryText: initialData.cta_secondary_text || "Tư vấn ngay",
      ctaSecondaryUrl: initialData.cta_secondary_url || "/contact",
      communityTitle: initialData.community_title || "Cộng đồng",
      communityText: initialData.community_text || "Gia nhập cộng đồng HR",
      internationalTitle: initialData.international_title || "Tiêu chuẩn quốc tế",
      internationalText: initialData.international_text || "Chương trình đào tạo chuẩn quốc tế",
    }
  }, [initialData])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    values: formValues,
    defaultValues: {
      name: "", slogan: "", description: "", address: "", phone: "", email: "",
      zaloUrl: "", facebookUrl: "", mapUrl: "", logoUrl: "", bannerUrl: "",
      statsCourses: 50, statsStudents: 12000, statsRating: 4.9, showStats: false,
      heroBadgeText: "Chào mừng bạn đến với EduCenter",
      ctaPrimaryText: "Khám phá khóa học",
      ctaSecondaryText: "Tư vấn ngay",
      ctaSecondaryUrl: "/contact",
      communityTitle: "Cộng đồng",
      communityText: "Gia nhập cộng đồng HR",
      internationalTitle: "Tiêu chuẩn quốc tế",
      internationalText: "Chương trình đào tạo chuẩn quốc tế",
    }
  })

  // Sync preview URLs with latest server data when initialData changes
  useEffect(() => {
    if (initialData?.logo_url) setLogoPreviewUrl(initialData.logo_url)
    if (initialData?.banner_url) setBannerPreviewUrl(initialData.banner_url)
  }, [initialData])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })
      // Map camelCase fields to snake_case keys server expects
      formData.set('logoUrl', values.logoUrl || '')
      formData.set('bannerUrl', values.bannerUrl || '')

      const result = await updateCenterInfo(formData)
      if (result?.error) throw new Error(result.error)
      toast.success("Cập nhật thành công!")
      router.refresh()
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

              <TabsContent value="media" className="mt-0 space-y-10">
                {/* Logo URL */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-secondary" /> Logo trung tâm (URL)
                  </label>
                  <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="https://i.imgur.com/abc.png..."
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              setLogoImgError(false)
                              setLogoPreviewUrl(e.target.value)
                            }}
                            className="h-12 rounded-xl font-mono text-sm"
                          />
                        </FormControl>
                        <p className="text-xs text-slate-400">Dán URL ảnh trực tiếp vào ô — ảnh preview xuất hiện ngay bên dưới khi URL hợp lệ.</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {logoPreviewUrl && (
                    <div className="flex items-start gap-4">
                      <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 flex-shrink-0 flex items-center justify-center">
                        {!logoImgError ? (
                          <img
                            src={logoPreviewUrl}
                            alt="Logo preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain p-2"
                            onLoad={() => setLogoImgError(false)}
                            onError={() => setLogoImgError(true)}
                          />
                        ) : (
                          <div className="text-center px-2">
                            <ImageIcon className="w-8 h-8 text-red-300 mx-auto" />
                            <p className="text-[10px] text-red-400 mt-1">Không tải được</p>
                          </div>
                        )}
                      </div>
                      <div className="text-xs space-y-1 pt-2">
                        {logoImgError ? (
                          <p className="font-bold text-red-500">⚠️ URL không hiện ảnh được. Thử dùng Imgur.</p>
                        ) : (
                          <p className="font-bold text-green-600">✅ Preview logo OK</p>
                        )}
                        <p className="text-slate-400">URL: <span className="font-mono break-all">{logoPreviewUrl.slice(0, 50)}...</span></p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Banner URL */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-secondary" /> Banner trang chủ (URL)
                  </label>
                  <FormField
                    control={form.control}
                    name="bannerUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="https://images.unsplash.com/photo-xxx?w=1920..."
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              setBannerImgError(false)
                              setBannerPreviewUrl(e.target.value)
                            }}
                            className="h-12 rounded-xl font-mono text-sm"
                          />
                        </FormControl>
                        <p className="text-xs text-slate-400">Khuyến dùng: Unsplash, Imgur. Kích thước 1920×1080.</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {bannerPreviewUrl && (
                    <div className="space-y-2">
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 flex items-center justify-center">
                        {!bannerImgError ? (
                          <img
                            src={bannerPreviewUrl}
                            alt="Banner preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onLoad={() => setBannerImgError(false)}
                            onError={() => setBannerImgError(true)}
                          />
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="w-12 h-12 text-red-200 mx-auto" />
                            <p className="text-sm text-red-400 mt-2">Không tải được ảnh từ URL này</p>
                          </div>
                        )}
                      </div>
                      {bannerImgError ? (
                        <p className="text-xs text-red-500 font-bold">⚠️ URL này không hợp lệ hoặc bị chặn. Thử link Imgur hoặc Unsplash khác.</p>
                      ) : (
                        <p className="text-xs text-green-600 font-bold">✅ Preview banner OK — nhấn Lưu để áp dụng</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-amber-900 space-y-3">
                  <p className="font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> HƯỚNG DẪN QUAN TRỌNG:
                  </p>
                  <p>Để ảnh hiển thị được, bạn phải lấy <strong>"Địa chỉ hình ảnh"</strong>, không phải link trang web.</p>
                  <ul className="space-y-2 list-disc list-inside text-amber-800">
                    <li><strong>Cách làm:</strong> Chuột phải vào ảnh bạn muốn → Chọn <strong>"Sao chép địa chỉ hình ảnh"</strong> (Copy Image Address).</li>
                    <li><strong>Link đúng:</strong> Thường kết thúc bằng <code>.jpg</code>, <code>.png</code> hoặc có nhiều chữ số.</li>
                    <li><strong>Link sai:</strong> Link có chữ <code>/photo-xxx</code> mà không có phần mở rộng ảnh thường là link trang web, không dùng được.</li>
                    <li><strong>Mẹo:</strong> Sau khi dán link, nếu thấy <strong>"✅ Preview OK"</strong> hiện ra bên dưới thì link đó chắc chắn hoạt động.</li>
                  </ul>
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
