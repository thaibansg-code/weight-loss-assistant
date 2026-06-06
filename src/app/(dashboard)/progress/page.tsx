import { createClient } from '@/lib/supabase/server'
import WeightChart from '@/components/dashboard/WeightChart'
import CalorieHistoryChart from '@/components/dashboard/CalorieHistoryChart'
import { TrendingDown, Flame, Apple, Award } from 'lucide-react'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const since = thirtyDaysAgo.toISOString()

  const [weightRes, profileRes, mealsRes] = await Promise.all([
    supabase.from('weight_logs').select('*').eq('user_id', user!.id).order('logged_at', { ascending: false }).limit(90),
    supabase.from('user_profiles').select('*').eq('user_id', user!.id).single(),
    supabase.from('meal_logs').select('calories,logged_at').eq('user_id', user!.id).gte('logged_at', since).order('logged_at'),
  ])

  const logs = weightRes.data ?? []
  const profile = profileRes.data
  const meals = mealsRes.data ?? []

  const firstWeight = logs[logs.length - 1]?.weight_kg
  const latestWeight = logs[0]?.weight_kg ?? profile?.current_weight_kg
  const totalLost = firstWeight && latestWeight ? firstWeight - latestWeight : 0
  const remaining = latestWeight && profile?.target_weight_kg ? latestWeight - profile.target_weight_kg : null
  const progressPct = firstWeight && profile?.target_weight_kg && firstWeight !== profile.target_weight_kg
    ? Math.min(100, Math.max(0, Math.round(((firstWeight - (latestWeight ?? firstWeight)) / (firstWeight - profile.target_weight_kg)) * 100)))
    : 0

  // Calorie history by day (last 14 days)
  const calorieByDay: Record<string, number> = {}
  meals.forEach((m) => {
    const day = m.logged_at.split('T')[0]
    calorieByDay[day] = (calorieByDay[day] ?? 0) + m.calories
  })

  const avgDailyCalories = Object.keys(calorieByDay).length > 0
    ? Math.round(Object.values(calorieByDay).reduce((s, v) => s + v, 0) / Object.keys(calorieByDay).length)
    : 0

  const daysLogged = Object.keys(calorieByDay).length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <TrendingDown className="w-6 h-6 text-green-600" /> ความคืบหน้า
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'น้ำหนักที่ลด',
            value: totalLost > 0 ? `-${totalLost.toFixed(1)} kg` : '0 kg',
            sub: `เริ่มต้น ${firstWeight ?? '-'} kg`,
            icon: TrendingDown, color: 'text-green-600', bg: 'bg-green-50',
          },
          {
            label: 'น้ำหนักปัจจุบัน',
            value: latestWeight ? `${latestWeight} kg` : '-',
            sub: `เป้า ${profile?.target_weight_kg ?? '-'} kg`,
            icon: Award, color: 'text-blue-600', bg: 'bg-blue-50',
          },
          {
            label: 'แคลอรี่เฉลี่ย/วัน',
            value: avgDailyCalories > 0 ? `${avgDailyCalories.toLocaleString()}` : '-',
            sub: `เป้า ${profile?.daily_calorie_target ?? '-'} kcal`,
            icon: Apple, color: 'text-orange-600', bg: 'bg-orange-50',
          },
          {
            label: 'วันที่บันทึก',
            value: `${daysLogged} วัน`,
            sub: 'ใน 30 วันที่ผ่านมา',
            icon: Flame, color: 'text-red-500', bg: 'bg-red-50',
          },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Goal progress bar */}
      {profile && firstWeight && profile.target_weight_kg && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-700">เป้าหมายน้ำหนัก</h3>
            <span className="text-sm font-bold text-green-600">{progressPct}%</span>
          </div>
          <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>เริ่ม {firstWeight} kg</span>
            {remaining !== null && remaining > 0 && <span>เหลืออีก {remaining.toFixed(1)} kg</span>}
            <span>เป้า {profile.target_weight_kg} kg</span>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeightChart logs={logs} />
        <CalorieHistoryChart calorieByDay={calorieByDay} target={profile?.daily_calorie_target ?? 1800} />
      </div>
    </div>
  )
}
