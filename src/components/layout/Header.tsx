'use client'

import { useRouter } from 'next/navigation'
import { Scale, LogOut } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Header({ user }: { user: User }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="h-14 md:h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* โลโก้ แสดงเฉพาะ mobile */}
      <Link href="/dashboard" className="flex md:hidden items-center gap-2 text-green-600">
        <Scale className="w-6 h-6" />
        <span className="font-bold text-base">ผู้ช่วยลดน้ำหนัก</span>
      </Link>

      {/* placeholder desktop */}
      <div className="hidden md:block" />

      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm shrink-0">
            {user.email?.[0].toUpperCase()}
          </div>
          <span className="hidden sm:block text-sm text-gray-600 max-w-[140px] truncate">{user.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          title="ออกจากระบบ"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
