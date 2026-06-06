'use client'

import { useState, useEffect } from 'react'
import { Droplets, Plus, Minus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const DAILY_TARGET = 2000

export default function WaterPage() {
  const [waterMl, setWaterMl] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadWater() }, [])

  async function loadWater() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase.from('daily_goals').select('water_ml').eq('user_id', user.id).eq('date', today).single()
    if (data) setWaterMl(data.water_ml ?? 0)
  }

  async function addWater(ml: number) {
    const newAmount = Math.max(0, waterMl + ml)
    setWaterMl(newAmount)
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = new Date().toISOString().split('T')[0]
    await supabase.from('daily_goals').upsert({
      user_id: user.id,
      date: today,
      water_ml: newAmount,
      water_target_ml: DAILY_TARGET,
    })
    setLoading(false)
  }

  const pct = Math.min(100, Math.round((waterMl / DAILY_TARGET) * 100))
  const glasses = Math.round(waterMl / 250)

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">บันทึกน้ำดื่ม</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#f0f9ff" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - pct / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Droplets className="w-8 h-8 text-blue-500 mb-1" />
            <span className="text-2xl font-bold text-gray-900">{pct}%</span>
          </div>
        </div>

        <p className="text-3xl font-bold text-blue-600">{waterMl} <span className="text-lg text-gray-500">ml</span></p>
        <p className="text-gray-500 text-sm mb-2">เป้าหมาย {DAILY_TARGET} ml ({DAILY_TARGET / 250} แก้ว)</p>
        <p className="text-blue-500 font-medium">{glasses} แก้วแล้ว!</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">เพิ่ม/ลดน้ำดื่ม</h3>
        <div className="grid grid-cols-3 gap-3">
          {[150, 250, 500].map((ml) => (
            <button
              key={ml}
              onClick={() => addWater(ml)}
              disabled={loading}
              className="flex flex-col items-center gap-1 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">+{ml} ml</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => addWater(-250)}
          disabled={loading || waterMl === 0}
          className="mt-3 w-full flex items-center justify-center gap-2 p-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl transition-colors text-sm"
        >
          <Minus className="w-4 h-4" /> ลด 250 ml
        </button>
      </div>
    </div>
  )
}
