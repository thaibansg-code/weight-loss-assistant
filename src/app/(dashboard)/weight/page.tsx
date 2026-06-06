'use client'

import { useState, useEffect } from 'react'
import { Scale, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { calculateBMI } from '@/lib/utils'

interface WeightLog {
  id: string
  weight_kg: number
  notes?: string
  logged_at: string
}

export default function WeightPage() {
  const [logs, setLogs] = useState<WeightLog[]>([])
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<{ height_cm: number } | null>(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [logsRes, profileRes] = await Promise.all([
      supabase.from('weight_logs').select('*').eq('user_id', user.id).order('logged_at', { ascending: false }).limit(30),
      supabase.from('user_profiles').select('height_cm').eq('user_id', user.id).single(),
    ])

    setLogs(logsRes.data ?? [])
    setProfile(profileRes.data)
  }

  async function logWeight(e: React.FormEvent) {
    e.preventDefault()
    if (!weight) return
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('weight_logs').insert({
      user_id: user!.id,
      weight_kg: parseFloat(weight),
      notes: notes || null,
    })

    await supabase.from('user_profiles').update({
      current_weight_kg: parseFloat(weight),
      updated_at: new Date().toISOString(),
    }).eq('user_id', user!.id)

    setWeight('')
    setNotes('')
    setLoading(false)
    loadData()
  }

  const latestWeight = logs[0]?.weight_kg
  const bmi = latestWeight && profile?.height_cm ? calculateBMI(latestWeight, profile.height_cm) : null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">บันทึกน้ำหนัก</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-500" /> บันทึกน้ำหนักวันนี้
          </h2>
          <form onSubmit={logWeight} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1.5">น้ำหนัก (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="เช่น 65.5"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1.5">หมายเหตุ (ไม่บังคับ)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="เช่น หลังตื่นนอน"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" /> บันทึก
            </button>
          </form>

          {bmi && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-600 font-medium">BMI ปัจจุบัน</p>
              <p className="text-3xl font-bold text-blue-700">{bmi.bmi}</p>
              <p className="text-sm text-blue-600 capitalize">{bmi.category}</p>
              <p className="text-xs text-blue-500 mt-1">น้ำหนักในเกณฑ์ปกติ: {bmi.ideal_weight_min}–{bmi.ideal_weight_max} kg</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">ประวัติน้ำหนัก</h2>
          {logs.length === 0 ? (
            <p className="text-gray-400 text-sm">ยังไม่มีประวัติน้ำหนัก</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{log.weight_kg} kg</p>
                    {log.notes && <p className="text-xs text-gray-400">{log.notes}</p>}
                  </div>
                  <span className="text-xs text-gray-400">{new Date(log.logged_at).toLocaleDateString('th-TH')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
