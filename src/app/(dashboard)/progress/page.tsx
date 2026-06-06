import { createClient } from '@/lib/supabase/server'
import WeightChart from '@/components/dashboard/WeightChart'
import { TrendingDown } from 'lucide-react'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [weightRes, profileRes] = await Promise.all([
    supabase.from('weight_logs').select('*').eq('user_id', user!.id).order('logged_at', { ascending: false }).limit(90),
    supabase.from('user_profiles').select('*').eq('user_id', user!.id).single(),
  ])

  const logs = weightRes.data ?? []
  const profile = profileRes.data

  const firstWeight = logs[logs.length - 1]?.weight_kg ?? profile?.current_weight_kg
  const latestWeight = logs[0]?.weight_kg ?? profile?.current_weight_kg
  const totalLost = firstWeight && latestWeight ? (firstWeight - latestWeight).toFixed(1) : '-'
  const remaining = latestWeight && profile?.target_weight_kg
    ? (latestWeight - profile.target_weight_kg).toFixed(1)
    : '-'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <TrendingDown className="w-6 h-6 text-green-600" /> ความคืบหน้า
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'น้ำหนักเริ่มต้น', value: firstWeight ? `${firstWeight} kg` : '-' },
          { label: 'น้ำหนักปัจจุบัน', value: latestWeight ? `${latestWeight} kg` : '-' },
          { label: 'ลดไปแล้ว', value: totalLost !== '-' ? `${totalLost} kg` : '-', green: parseFloat(totalLost) > 0 },
          { label: 'เหลืออีก', value: remaining !== '-' ? `${remaining} kg` : '-' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-500 mb-2">{s.label}</p>
            <p className={`text-2xl font-bold ${s.green ? 'text-green-600' : 'text-gray-900'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <WeightChart logs={logs} />

      {profile && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">เป้าหมายของคุณ</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-100 rounded-full h-3 relative overflow-hidden">
              {firstWeight && latestWeight && profile.target_weight_kg && (
                <div
                  className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.max(0, ((firstWeight - latestWeight) / (firstWeight - profile.target_weight_kg)) * 100))}%`
                  }}
                />
              )}
            </div>
            <span className="text-sm text-gray-600 whitespace-nowrap">
              เป้า: {profile.target_weight_kg} kg
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
