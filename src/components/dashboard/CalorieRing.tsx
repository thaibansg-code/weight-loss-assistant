'use client'

interface Props {
  consumed: number
  burned: number
  target: number
}

export default function CalorieRing({ consumed, burned, target }: Props) {
  const net = consumed - burned
  const pct = Math.min(100, Math.round((net / target) * 100))
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference
  const color = pct > 100 ? '#ef4444' : pct > 80 ? '#f59e0b' : '#22c55e'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">แคลอรี่วันนี้</h3>
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="16" />
            <circle
              cx="90" cy="90" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="16"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 90 90)"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-gray-900">{net.toLocaleString()}</span>
            <span className="text-xs text-gray-500">/ {target.toLocaleString()} kcal</span>
            <span className="text-xs font-medium mt-1" style={{ color }}>{pct}%</span>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">รับประทาน</span>
          <span className="font-medium text-orange-500">{consumed.toLocaleString()} kcal</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">เผาผลาญ</span>
          <span className="font-medium text-red-500">-{burned.toLocaleString()} kcal</span>
        </div>
      </div>
    </div>
  )
}
