'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Scale, LayoutDashboard, Apple, Dumbbell, MessageCircle, TrendingDown, Settings, Droplets } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'หน้าแรก' },
  { href: '/meals', icon: Apple, label: 'อาหาร' },
  { href: '/exercise', icon: Dumbbell, label: 'ออกกำลัง' },
  { href: '/weight', icon: Scale, label: 'น้ำหนัก' },
  { href: '/water', icon: Droplets, label: 'น้ำ' },
  { href: '/progress', icon: TrendingDown, label: 'คืบหน้า' },
  { href: '/ai-coach', icon: MessageCircle, label: 'AI Coach' },
  { href: '/settings', icon: Settings, label: 'ตั้งค่า' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-bottom">
      <div className="flex overflow-x-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 min-w-[56px] flex flex-col items-center gap-0.5 py-2 px-1 transition-colors',
                active ? 'text-green-600' : 'text-gray-400'
              )}
            >
              <Icon className={cn('w-5 h-5', active && 'scale-110')} />
              <span className="text-[9px] font-medium leading-tight text-center">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
