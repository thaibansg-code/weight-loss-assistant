'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Scale, LayoutDashboard, Apple, Dumbbell, MessageCircle, TrendingDown, Settings, Droplets } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'ภาพรวม' },
  { href: '/meals', icon: Apple, label: 'มื้ออาหาร' },
  { href: '/exercise', icon: Dumbbell, label: 'ออกกำลังกาย' },
  { href: '/weight', icon: Scale, label: 'น้ำหนัก' },
  { href: '/water', icon: Droplets, label: 'น้ำดื่ม' },
  { href: '/progress', icon: TrendingDown, label: 'ความคืบหน้า' },
  { href: '/ai-coach', icon: MessageCircle, label: 'AI Coach' },
  { href: '/settings', icon: Settings, label: 'ตั้งค่า' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2 text-green-600">
          <Scale className="w-7 h-7" />
          <span className="font-bold text-lg leading-tight">ผู้ช่วย<br />ลดน้ำหนัก</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-green-50 rounded-xl p-3 text-xs text-green-700">
          <p className="font-medium mb-1">เคล็ดลับวันนี้</p>
          <p>ดื่มน้ำอย่างน้อย 8 แก้วต่อวันช่วยเร่งการเผาผลาญ!</p>
        </div>
      </div>
    </aside>
  )
}
