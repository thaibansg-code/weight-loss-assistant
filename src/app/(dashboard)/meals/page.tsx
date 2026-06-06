'use client'

import { useState, useEffect, useMemo } from 'react'
import { Apple, Plus, Trash2, Search, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { THAI_FOODS, FOOD_CATEGORIES, type ThaiFood } from '@/lib/thai-foods'

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
  const [tab, setTab] = useState<'quick' | 'manual'>('quick')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด')
  const [selectedMealType, setSelectedMealType] = useState('breakfast')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    meal_type: 'breakfast', food_name: '', calories: '', protein_g: '', carbs_g: '', fat_g: '', quantity: '1', unit: 'จาน',
  })

  useEffect(() => { loadMeals() }, [])

  async function loadMeals() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase.from('meal_logs').select('*').eq('user_id', user.id).gte('logged_at', today).order('logged_at', { ascending: false })
    setLogs(data ?? [])
  }

  async function quickAdd(food: ThaiFood) {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('meal_logs').insert({
      user_id: user.id,
      meal_type: selectedMealType,
      food_name: food.name,
      calories: food.calories,
      protein_g: food.protein_g,
      carbs_g: food.carbs_g,
      fat_g: food.fat_g,
      quantity: 1,
      unit: food.unit,
    })
    setLoading(false)
    loadMeals()
  }

  async function addManual(e: React.FormEvent) {
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

  const filteredFoods = useMemo(() => {
    return THAI_FOODS.filter((f) => {
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = selectedCategory === 'ทั้งหมด' || f.category === selectedCategory
      return matchSearch && matchCat
    })
  }, [search, selectedCategory])

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
        {/* Add Food Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {([['quick', 'เพิ่มเร็ว'], ['manual', 'กรอกเอง']] as const).map(([v, l]) => (
              <button
                key={v}
                onClick={() => setTab(v)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === v ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {l}
              </button>
            ))}
          </div>

          {tab === 'quick' ? (
            <div className="p-4 space-y-3">
              {/* Meal type selector */}
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {mealTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="ค้นหาอาหาร..."
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category pills */}
              <div className="flex gap-1.5 flex-wrap">
                {['ทั้งหมด', ...FOOD_CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-colors ${selectedCategory === cat ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Food list */}
              <div className="space-y-1.5 max-h-80 overflow-y-auto">
                {filteredFoods.map((food) => (
                  <button
                    key={food.name}
                    onClick={() => quickAdd(food)}
                    disabled={loading}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-green-50 border border-gray-100 hover:border-green-200 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{food.name}</p>
                        <p className="text-xs text-gray-400">{food.unit} · P:{food.protein_g}g C:{food.carbs_g}g F:{food.fat_g}g</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-orange-500">{food.calories}</span>
                        <span className="text-xs text-gray-400">kcal</span>
                        <Plus className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </button>
                ))}
                {filteredFoods.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-4">ไม่พบอาหารที่ค้นหา</p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <form onSubmit={addManual} className="space-y-3">
                <select value={form.meal_type} onChange={(e) => setForm({ ...form, meal_type: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {mealTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <input type="text" value={form.food_name} onChange={(e) => setForm({ ...form, food_name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="ชื่ออาหาร" required />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="แคลอรี่ (kcal)" required />
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
          )}
        </div>

        {/* Meal Log */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">มื้ออาหารวันนี้</h2>
          <div className="flex gap-4 text-xs text-gray-400 mb-4">
            {mealTypes.map((t) => {
              const cal = logs.filter(l => l.meal_type === t.value).reduce((s, l) => s + l.calories, 0)
              return <span key={t.value}>{t.label}: <strong className="text-gray-600">{cal} kcal</strong></span>
            })}
          </div>

          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2">
              <Apple className="w-8 h-8 opacity-30" />
              <p className="text-sm">ยังไม่ได้บันทึกมื้ออาหาร</p>
            </div>
          ) : (
            <div className="space-y-2">
              {mealTypes.map((t) => {
                const typeLogs = logs.filter((l) => l.meal_type === t.value)
                if (typeLogs.length === 0) return null
                return (
                  <div key={t.value}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{t.label}</p>
                    {typeLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 pl-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{log.food_name}</p>
                          <p className="text-xs text-gray-400">P:{log.protein_g}g C:{log.carbs_g}g F:{log.fat_g}g</p>
                        </div>
                        <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                          <span className="text-sm font-semibold text-orange-500">{log.calories} kcal</span>
                          <button onClick={() => deleteMeal(log.id)} className="text-gray-200 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )}

          {/* Macro summary */}
          {logs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3">
              {[
                { label: 'โปรตีน', value: logs.reduce((s, l) => s + l.protein_g, 0).toFixed(1), unit: 'g', color: 'text-blue-500' },
                { label: 'คาร์บ', value: logs.reduce((s, l) => s + l.carbs_g, 0).toFixed(1), unit: 'g', color: 'text-yellow-500' },
                { label: 'ไขมัน', value: logs.reduce((s, l) => s + l.fat_g, 0).toFixed(1), unit: 'g', color: 'text-red-400' },
              ].map((m) => (
                <div key={m.label} className="text-center bg-gray-50 rounded-xl py-2">
                  <p className="text-xs text-gray-400">{m.label}</p>
                  <p className={`text-lg font-bold ${m.color}`}>{m.value}<span className="text-xs font-normal text-gray-400">{m.unit}</span></p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
