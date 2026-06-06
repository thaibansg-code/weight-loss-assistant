'use client'

import { useRouter } from 'next/navigation'
import { Scale, LogOut, Menu } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Props {
  user: User
  onMenuClick?: () => void
}

export default function Header({ user, onMenuClick }: Props) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        {/* ปุ่มเมนู — แสดงเฉพาะ mobile/tablet */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="เปิดเมนู"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* โลโก้ — แสดงเฉพาะ mobile */}
        <Link href="/dashboard" className="flex lg:hidden items-center gap-2 text-green-600">
          <Scale className="w-5 h-5" />
          <span className="font-bold text-sm">ผู้ช่วยลดน้ำหนัก</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm shrink-0">
            {user.email?.[0].toUpperCase()}
          </div>
          <span className="hidden sm:block text-sm text-gray-600 max-w-[160px] truncate">{user.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          title="ออกจากระบบ"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
