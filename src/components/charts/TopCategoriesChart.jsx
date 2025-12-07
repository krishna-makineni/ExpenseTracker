import { useMemo } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CATEGORY_EMOJI } from '../../constants.js'

export default function TopCategoriesChart({ data }) {
  const { maxValue, formatter } = useMemo(() => {
    if (!data || data.length === 0) {
      return { maxValue: 0, formatter: (v) => `₹${v}` }
    }
    const max = Math.max(...data.map(([_, total]) => total || 0))
    const roundedMax = Math.ceil(max * 1.1) // Add 10% padding
    
    const formatValue = (value) => {
      if (value >= 100000) {
        return `₹${(value / 100000).toFixed(1)}L`
      } else if (value >= 1000) {
        return `₹${(value / 1000).toFixed(1)}k`
      }
      return `₹${value}`
    }
    
    return { maxValue: roundedMax, formatter: formatValue }
  }, [data])

  if (!data || data.length === 0) {
    return <EmptyState />
  }

  const chartData = data.map(([category, total]) => ({
    category: `${CATEGORY_EMOJI[category] ?? ''} ${category}`,
    total,
  }))

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, left: 40, bottom: 0 }}>
        <XAxis 
          type="number" 
          domain={[0, maxValue]} 
          stroke="#94a3b8" 
          tickFormatter={formatter} 
        />
        <YAxis type="category" dataKey="category" stroke="#94a3b8" width={120} />
        <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
        <Bar dataKey="total" fill="#f97316" radius={[4, 4, 4, 4]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
      Track more expenses to see top spending categories.
    </div>
  )
}

