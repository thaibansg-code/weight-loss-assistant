'use client'

import { useState, useEffect } from 'react'
import { Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { calculateTDEE, calculateCalorieTarget } from '@/lib/utils'

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: '', age: '', gender: 'male', height_cm: '', current_weight_kg: '',
    target_weight_kg: '', activity_level: 'moderate', goal: 'lose_weight',
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadProfile() }, [])

  async function loadProfile() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('user_profiles').select('*').eq('user_id', user.id).single()
    if (data) {
      setForm({
        name: data.name ?? '',
        age: data.age?.toString() ?? '',
        gender: data.gender ?? 'male',
        height_cm: data.height_cm?.toString() ?? '',
        current_weight_kg: data.current_weight_kg?.toString() ?? '',
        target_weight_kg: data.target_weight_kg?.toString() ?? '',
        activity_level: data.activity_level ?? 'moderate',
        goal: data.goal ?? 'lose_weight',
      })
    }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const tdee = calculateTDEE(
      parseFloat(form.current_weight_kg),
      parseFloat(form.height_cm),
      parseInt(form.age),
      form.gender as 'male' | 'female' | 'other',
      form.activity_level
    )
    const daily_calorie_target = calculateCalorieTarget(tdee, form.goal)

    await supabase.from('user_profiles').upsert({
      user_id: user.id,
      name: form.name,
      age: parseInt(form.age),
      gender: form.gender,
      height_cm: parseFloat(form.height_cm),
      current_weight_kg: parseFloat(form.current_weight_kg),
      target_weight_kg: parseFloat(form.target_weight_kg),
      activity_level: form.activity_level,
      goal: form.goal,
      daily_calorie_target,
      updated_at: new Date().toISOString(),
    })

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Settings className="w-6 h-6" /> ตั้งค่าโปรไฟล์
      </h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={saveProfile} className="space-y-5">
          {saved && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm">บันทึกสำเร็จ!</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">ชื่อ</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="ชื่อของคุณ" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">อายุ</label>
              <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="25" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">เพศ</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">ส่วนสูง (cm)</label>
              <input type="number" step="0.1" value={form.height_cm} onChange={(e) => setForm({ ...form, height_cm: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="170" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">น้ำหนักปัจจุบัน (kg)</label>
              <input type="number" step="0.1" value={form.current_weight_kg} onChange={(e) => setForm({ ...form, current_weight_kg: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="70" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">น้ำหนักเป้าหมาย (kg)</label>
              <input type="number" step="0.1" value={form.target_weight_kg} onChange={(e) => setForm({ ...form, target_weight_kg: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="60" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">ระดับการออกกำลังกาย</label>
              <select value={form.activity_level} onChange={(e) => setForm({ ...form, activity_level: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="sedentary">ไม่ค่อยเคลื่อนไหว</option>
                <option value="light">เบา (1-3 วัน/สัปดาห์)</option>
                <option value="moderate">ปานกลาง (3-5 วัน/สัปดาห์)</option>
                <option value="active">หนัก (6-7 วัน/สัปดาห์)</option>
                <option value="very_active">หนักมาก (2 ครั้ง/วัน)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">เป้าหมาย</label>
              <select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="lose_weight">ลดน้ำหนัก</option>
                <option value="maintain">คงน้ำหนัก</option>
                <option value="gain_muscle">เพิ่มกล้ามเนื้อ</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3 rounded-xl transition-colors">
            {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </button>
        </form>
      </div>
    </div>
  )
}
