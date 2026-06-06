import { createClient } from '@/lib/supabase/server'
import DashboardStats from '@/components/dashboard/DashboardStats'
import CalorieRing from '@/components/dashboard/CalorieRing'
import RecentActivity from '@/components/dashboard/RecentActivity'
import WeightChart from '@/components/dashboard/WeightChart'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date().toISOString().split('T')[0]

  const [profileRes, mealsRes, exerciseRes, weightRes] = await Promise.all([
    supabase.from('user_profiles').select('*').eq('user_id', user!.id).single(),
    supabase.from('meal_logs').select('*').eq('user_id', user!.id).gte('logged_at', today),
    supabase.from('exercise_logs').select('*').eq('user_id', user!.id).gte('logged_at', today),
    supabase.from('weight_logs').select('*').eq('user_id', user!.id).order('logged_at', { ascending: false }).limit(30),
  ])

  const profile = profileRes.data
  const meals = mealsRes.data ?? []
  const exercises = exerciseRes.data ?? []
  const weightLogs = weightRes.data ?? []

  const totalCaloriesConsumed = meals.reduce((sum, m) => sum + m.calories, 0)
  const totalCaloriesBurned = exercises.reduce((sum, e) => sum + e.calories_burned, 0)
  const calorieTarget = profile?.daily_calorie_target ?? 1800

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">สวัสดี, {profile?.name ?? user?.email} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">ติดตามความคืบหน้าของวันนี้</p>
      </div>

      <DashboardStats
        caloriesConsumed={totalCaloriesConsumed}
        caloriesBurned={totalCaloriesBurned}
        calorieTarget={calorieTarget}
        currentWeight={profile?.current_weight_kg}
        targetWeight={profile?.target_weight_kg}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CalorieRing
          consumed={totalCaloriesConsumed}
          burned={totalCaloriesBurned}
          target={calorieTarget}
        />
        <div className="lg:col-span-2">
          <WeightChart logs={weightLogs} />
        </div>
      </div>

      <RecentActivity meals={meals} exercises={exercises} />
    </div>
  )
}
