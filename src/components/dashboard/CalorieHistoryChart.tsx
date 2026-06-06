'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

interface Props {
  calorieByDay: Record<string, number>
  target: number
}

export default function CalorieHistoryChart({ calorieByDay, target }: Props) {
  const data = Object.entries(calorieByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, calories]) => ({
      date: format(new Date(date), 'd MMM', { locale: th }),
      calories,
      overTarget: calories > target,
    }))

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">แคลอรี่รายวัน (14 วันล่าสุด)</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
          ยังไม่มีข้อมูลแคลอรี่
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} unit=" kcal" width={60} />
            <Tooltip
              formatter={(v) => [`${v} kcal`, 'แคลอรี่']}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }}
            />
            <ReferenceLine y={target} stroke="#22c55e" strokeDasharray="4 2" label={{ value: `เป้า ${target}`, position: 'right', fontSize: 10, fill: '#22c55e' }} />
            <Bar
              dataKey="calories"
              radius={[4, 4, 0, 0]}
              fill="#fb923c"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
