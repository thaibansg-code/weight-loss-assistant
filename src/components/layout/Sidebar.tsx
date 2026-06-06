'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Scale, LayoutDashboard, Apple, Dumbbell, MessageCircle, TrendingDown, Settings, Droplets, X } from 'lucide-react'
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

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-100 flex flex-col shadow-lg lg:shadow-none">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-green-600" onClick={onClose}>
          <Scale className="w-7 h-7 shrink-0" />
          <span className="font-bold text-lg leading-tight">ผู้ช่วย<br />ลดน้ำหนัก</span>
        </Link>
        {/* ปุ่มปิด — แสดงเฉพาะ mobile */}
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-green-50 rounded-xl p-3 text-xs text-green-700">
          <p className="font-medium mb-1">เคล็ดลับวันนี้</p>
          <p>ดื่มน้ำอย่างน้อย 8 แก้วต่อวัน ช่วยเร่งการเผาผลาญ!</p>
        </div>
      </div>
    </aside>
  )
}
