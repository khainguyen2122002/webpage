'use client'

import React, { useState, useEffect } from 'react'
import { GraduationCap, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SmartImageProps {
  src?: string | null
  alt: string
  className?: string
  fallbackType: 'banner' | 'logo'
  containerClassName?: string
}

export function SmartImage({ 
  src, 
  alt, 
  className, 
  fallbackType,
  containerClassName 
}: SmartImageProps) {
  const [error, setError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string | null>(src || null)

  const defaultBanner = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"

  useEffect(() => {
    setCurrentSrc(src || null)
    setError(false)
  }, [src])

  if (!currentSrc || error) {
    if (fallbackType === 'banner') {
      return (
        <div className={cn("relative w-full h-full overflow-hidden bg-[#0A3D2B]", containerClassName)}>
          <img 
            src={defaultBanner} 
            alt={alt}
            className={cn("w-full h-full object-cover opacity-50", className)}
            onError={(e) => {
               // Absolute fallback to gradient if target AND default both fail
               (e.currentTarget as HTMLImageElement).style.display = 'none';
               (e.currentTarget as HTMLImageElement).parentElement!.style.background = 'linear-gradient(135deg, #0A3D2B 0%, #1a5c45 100%)';
            }}
          />
        </div>
      )
    }

    return (
      <div className={cn("flex items-center justify-center bg-primary rounded-lg p-2", containerClassName)}>
        <GraduationCap className="text-secondary w-6 h-6" />
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <img
        src={currentSrc}
        alt={alt}
        className={cn("w-full h-full transition-opacity duration-300", className)}
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
      />
    </div>
  )
}
