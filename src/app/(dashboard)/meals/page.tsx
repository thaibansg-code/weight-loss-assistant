'use client'

import { useState, useEffect } from 'react'
import { Apple, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface MealLog {
  id: string
  meal_type: string
  food_name: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  quantity: number
  unit: string
  logged_at: string
}

const mealTypes = [
  { value: 'breakfast', label: 'เช้า' },
  { value: 'lunch', label: 'กลางวัน' },
  { value: 'dinner', label: 'เย็น' },
  { value: 'snack', label: 'ของว่าง' },
]

export default function MealsPage() {
  const [logs, setLogs] = useState<MealLog[]>([])
  const [form, setForm] = useState({
    meal_type: 'breakfast', food_name: '', calories: '', protein_g: '', carbs_g: '', fat_g: '', quantity: '1', unit: 'จาน',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadMeals() }, [])

  async function loadMeals() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase.from('meal_logs').select('*').eq('user_id', user.id).gte('logged_at', today).order('logged_at', { ascending: false })
    setLogs(data ?? [])
  }

  async function addMeal(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('meal_logs').insert({
      user_id: user!.id,
      ...form,
      calories: parseInt(form.calories),
      protein_g: parseFloat(form.protein_g || '0'),
      carbs_g: parseFloat(form.carbs_g || '0'),
      fat_g: parseFloat(form.fat_g || '0'),
      quantity: parseFloat(form.quantity),
    })

    setForm({ meal_type: 'breakfast', food_name: '', calories: '', protein_g: '', carbs_g: '', fat_g: '', quantity: '1', unit: 'จาน' })
    setLoading(false)
    loadMeals()
  }

  async function deleteMeal(id: string) {
    const supabase = createClient()
    await supabase.from('meal_logs').delete().eq('id', id)
    loadMeals()
  }

  const totalCalories = logs.reduce((s, m) => s + m.calories, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">บันทึกมื้ออาหาร</h1>
        <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-sm font-medium">
          รวม {totalCalories.toLocaleString()} kcal วันนี้
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Apple className="w-4 h-4 text-orange-500" /> เพิ่มมื้ออาหาร
          </h2>
          <form onSubmit={addMeal} className="space-y-3">
            <select
              value={form.meal_type}
              onChange={(e) => setForm({ ...form, meal_type: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {mealTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <input
              type="text"
              value={form.food_name}
              onChange={(e) => setForm({ ...form, food_name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="ชื่ออาหาร"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="แคลอรี่" required />
              <input type="number" step="0.1" value={form.protein_g} onChange={(e) => setForm({ ...form, protein_g: e.target.value })} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="โปรตีน (g)" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" step="0.1" value={form.carbs_g} onChange={(e) => setForm({ ...form, carbs_g: e.target.value })} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="คาร์บ (g)" />
              <input type="number" step="0.1" value={form.fat_g} onChange={(e) => setForm({ ...form, fat_g: e.target.value })} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="ไขมัน (g)" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
              <Plus className="w-4 h-4" /> เพิ่มมื้ออาหาร
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">มื้ออาหารวันนี้</h2>
          {logs.length === 0 ? <p className="text-gray-400 text-sm">ยังไม่ได้บันทึกมื้ออาหาร</p> : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                        {mealTypes.find(t => t.value === log.meal_type)?.label}
                      </span>
                      <p className="text-sm font-medium text-gray-800">{log.food_name}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      P:{log.protein_g}g C:{log.carbs_g}g F:{log.fat_g}g
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-orange-500">{log.calories} kcal</span>
                    <button onClick={() => deleteMeal(log.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
