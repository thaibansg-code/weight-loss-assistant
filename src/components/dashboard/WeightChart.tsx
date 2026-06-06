'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

interface WeightLog {
  weight_kg: number
  logged_at: string
}

export default function WeightChart({ logs }: { logs: WeightLog[] }) {
  const data = [...logs].reverse().map((l) => ({
    date: format(new Date(l.logged_at), 'd MMM', { locale: th }),
    weight: l.weight_kg,
  }))

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">กราฟน้ำหนัก (30 วัน)</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
          ยังไม่มีข้อมูลน้ำหนัก
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} unit=" kg" />
            <Tooltip
              formatter={(v) => [`${v} kg`, 'น้ำหนัก']}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={{ fill: '#22c55e', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
