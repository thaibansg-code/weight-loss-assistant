'use client'

import { useState, useEffect } from 'react'
import { Dumbbell, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ExerciseLog {
  id: string
  exercise_name: string
  exercise_type: string
  duration_minutes: number
  calories_burned: number
  notes?: string
  logged_at: string
}

const exerciseTypes = [
  { value: 'cardio', label: 'คาร์ดิโอ' },
  { value: 'strength', label: 'เวทเทรนนิ่ง' },
  { value: 'flexibility', label: 'ยืดเหยียด' },
  { value: 'other', label: 'อื่นๆ' },
]

export default function ExercisePage() {
  const [logs, setLogs] = useState<ExerciseLog[]>([])
  const [form, setForm] = useState({
    exercise_name: '', exercise_type: 'cardio', duration_minutes: '', calories_burned: '', notes: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadExercises() }, [])

  async function loadExercises() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase.from('exercise_logs').select('*').eq('user_id', user.id).gte('logged_at', today).order('logged_at', { ascending: false })
    setLogs(data ?? [])
  }

  async function addExercise(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('exercise_logs').insert({
      user_id: user!.id,
      ...form,
      duration_minutes: parseInt(form.duration_minutes),
      calories_burned: parseInt(form.calories_burned),
      notes: form.notes || null,
    })

    setForm({ exercise_name: '', exercise_type: 'cardio', duration_minutes: '', calories_burned: '', notes: '' })
    setLoading(false)
    loadExercises()
  }

  async function deleteExercise(id: string) {
    const supabase = createClient()
    await supabase.from('exercise_logs').delete().eq('id', id)
    loadExercises()
  }

  const totalBurned = logs.reduce((s, e) => s + e.calories_burned, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">บันทึกออกกำลังกาย</h1>
        <div className="shrink-0 bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium">
          เผาผลาญ {totalBurned.toLocaleString()} kcal
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-purple-500" /> เพิ่มการออกกำลังกาย
          </h2>
          <form onSubmit={addExercise} className="space-y-3">
            <input
              type="text"
              value={form.exercise_name}
              onChange={(e) => setForm({ ...form, exercise_name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="ชื่อการออกกำลังกาย"
              required
            />
            <select
              value={form.exercise_type}
              onChange={(e) => setForm({ ...form, exercise_type: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {exerciseTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="เวลา (นาที)" required />
              <input type="number" value={form.calories_burned} onChange={(e) => setForm({ ...form, calories_burned: e.target.value })} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="kcal เผาผลาญ" required />
            </div>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="หมายเหตุ (ไม่บังคับ)"
            />
            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
              <Plus className="w-4 h-4" /> บันทึก
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">การออกกำลังกายวันนี้</h2>
          {logs.length === 0 ? <p className="text-gray-400 text-sm">ยังไม่ได้บันทึกการออกกำลังกาย</p> : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                        {exerciseTypes.find(t => t.value === log.exercise_type)?.label}
                      </span>
                      <p className="text-sm font-medium text-gray-800">{log.exercise_name}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{log.duration_minutes} นาที{log.notes && ` · ${log.notes}`}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-red-500">-{log.calories_burned} kcal</span>
                    <button onClick={() => deleteExercise(log.id)} className="text-gray-300 hover:text-red-400 transition-colors">
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
