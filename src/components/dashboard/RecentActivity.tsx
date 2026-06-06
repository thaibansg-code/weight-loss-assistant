import { Apple, Dumbbell } from 'lucide-react'

interface MealLog { food_name: string; calories: number; meal_type: string }
interface ExerciseLog { exercise_name: string; calories_burned: number; duration_minutes: number }

export default function RecentActivity({ meals, exercises }: { meals: MealLog[]; exercises: ExerciseLog[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Apple className="w-4 h-4 text-orange-500" /> มื้ออาหารวันนี้
        </h3>
        {meals.length === 0 ? (
          <p className="text-gray-400 text-sm">ยังไม่ได้บันทึกมื้ออาหาร</p>
        ) : (
          <div className="space-y-2">
            {meals.slice(0, 5).map((m, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{m.food_name}</p>
                  <p className="text-xs text-gray-400 capitalize">{m.meal_type}</p>
                </div>
                <span className="text-sm font-semibold text-orange-500">{m.calories} kcal</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-purple-500" /> การออกกำลังกายวันนี้
        </h3>
        {exercises.length === 0 ? (
          <p className="text-gray-400 text-sm">ยังไม่ได้บันทึกการออกกำลังกาย</p>
        ) : (
          <div className="space-y-2">
            {exercises.slice(0, 5).map((e, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{e.exercise_name}</p>
                  <p className="text-xs text-gray-400">{e.duration_minutes} นาที</p>
                </div>
                <span className="text-sm font-semibold text-red-500">-{e.calories_burned} kcal</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
