import { Apple, Flame, Scale, Target } from 'lucide-react'

interface Props {
  caloriesConsumed: number
  caloriesBurned: number
  calorieTarget: number
  currentWeight?: number
  targetWeight?: number
}

export default function DashboardStats({ caloriesConsumed, caloriesBurned, calorieTarget, currentWeight, targetWeight }: Props) {
  const netCalories = caloriesConsumed - caloriesBurned
  const remaining = calorieTarget - netCalories

  const stats = [
    {
      label: 'แคลอรี่ที่รับประทาน',
      value: caloriesConsumed.toLocaleString(),
      unit: 'kcal',
      icon: Apple,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      label: 'แคลอรี่ที่เผาผลาญ',
      value: caloriesBurned.toLocaleString(),
      unit: 'kcal',
      icon: Flame,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      label: 'แคลอรี่คงเหลือ',
      value: Math.max(0, remaining).toLocaleString(),
      unit: 'kcal',
      icon: Target,
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      label: 'น้ำหนักปัจจุบัน',
      value: currentWeight?.toFixed(1) ?? '-',
      unit: currentWeight ? 'kg' : '',
      secondaryText: targetWeight ? `เป้าหมาย: ${targetWeight} kg` : undefined,
      icon: Scale,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
            <s.icon className={`w-5 h-5 ${s.color}`} />
          </div>
          <p className="text-xs text-gray-500 mb-1">{s.label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{s.value}</span>
            {s.unit && <span className="text-sm text-gray-500">{s.unit}</span>}
          </div>
          {s.secondaryText && <p className="text-xs text-gray-400 mt-1">{s.secondaryText}</p>}
        </div>
      ))}
    </div>
  )
}
