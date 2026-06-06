'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Scale } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { calculateTDEE, calculateCalorieTarget } from '@/lib/utils'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', age: '', gender: 'male', height_cm: '', current_weight_kg: '',
    target_weight_kg: '', activity_level: 'moderate', goal: 'lose_weight',
  })

  async function finish() {
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
      ...form,
      age: parseInt(form.age),
      height_cm: parseFloat(form.height_cm),
      current_weight_kg: parseFloat(form.current_weight_kg),
      target_weight_kg: parseFloat(form.target_weight_kg),
      daily_calorie_target,
    })

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-green-600 mb-3">
            <Scale className="w-8 h-8" />
            <span className="text-2xl font-bold">ผู้ช่วยลดน้ำหนัก</span>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2].map((s) => (
              <div key={s} className={`h-2 rounded-full transition-all ${s === step ? 'w-8 bg-green-500' : 'w-2 bg-gray-200'}`} />
            ))}
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {step === 1 ? 'บอกเราเกี่ยวกับตัวคุณ' : 'เป้าหมายของคุณ'}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
          {step === 1 ? (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">ชื่อ</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="ชื่อของคุณ" />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">ส่วนสูง (cm)</label>
                  <input type="number" value={form.height_cm} onChange={(e) => setForm({ ...form, height_cm: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="170" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">น้ำหนัก (kg)</label>
                  <input type="number" step="0.1" value={form.current_weight_kg} onChange={(e) => setForm({ ...form, current_weight_kg: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="70" />
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors">
                ถัดไป →
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">น้ำหนักเป้าหมาย (kg)</label>
                <input type="number" step="0.1" value={form.target_weight_kg} onChange={(e) => setForm({ ...form, target_weight_kg: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="60" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">เป้าหมาย</label>
                <select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="lose_weight">ลดน้ำหนัก</option>
                  <option value="maintain">คงน้ำหนัก</option>
                  <option value="gain_muscle">เพิ่มกล้ามเนื้อ</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">ระดับการออกกำลังกาย</label>
                <select value={form.activity_level} onChange={(e) => setForm({ ...form, activity_level: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="sedentary">ไม่ค่อยเคลื่อนไหว</option>
                  <option value="light">เบา (1-3 วัน/สัปดาห์)</option>
                  <option value="moderate">ปานกลาง (3-5 วัน/สัปดาห์)</option>
                  <option value="active">หนัก (6-7 วัน/สัปดาห์)</option>
                  <option value="very_active">หนักมาก</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  ← ย้อนกลับ
                </button>
                <button onClick={finish} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors">
                  เริ่มต้นเลย!
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
