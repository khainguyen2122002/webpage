import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner"
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#023605",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: "EduCenter - Trung tâm đào tạo chuyên nghiệp",
    template: "%s | EduCenter"
  },
  description: "Trang web giới thiệu trung tâm học thuật, các khóa học kỹ năng, ngoại ngữ và công nghệ chuẩn quốc tế.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: "EduCenter",
    description: "Nâng tầm sự nghiệp cùng EduCenter với các khóa học chuẩn quốc tế.",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduCenter - Đào tạo chuyên nghiệp",
    description: "Học tập đột phá, thành công vững bền cùng đội ngũ chuyên gia hàng đầu.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="vi" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col selection:bg-secondary/30 selection:text-primary`}
      >
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" richColors />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
