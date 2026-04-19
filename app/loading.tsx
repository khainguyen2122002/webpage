import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-xl">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full bg-primary/20" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-black text-primary animate-pulse tracking-tighter uppercase italic">
            EduCenter
          </h2>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    </div>
  )
}
