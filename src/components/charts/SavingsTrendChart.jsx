import { useMemo } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function SavingsTrendChart({ data }) {
  const { maxValue, minValue, formatter } = useMemo(() => {
    if (!data || data.length === 0) {
      return { maxValue: 0, minValue: 0, formatter: (v) => `₹${v}` }
    }
    const values = data.map((d) => d.savings || 0)
    const max = Math.max(...values)
    const min = Math.min(...values)
    const range = max - min
    const padding = range * 0.1 || Math.abs(max) * 0.1 || 1000
    
    const formatValue = (value) => {
      if (Math.abs(value) >= 100000) {
        return `₹${(value / 100000).toFixed(1)}L`
      } else if (Math.abs(value) >= 1000) {
        return `₹${(value / 1000).toFixed(1)}k`
      }
      return `₹${value}`
    }
    
    return { 
      maxValue: Math.ceil(max + padding), 
      minValue: Math.floor(min - padding),
      formatter: formatValue 
    }
  }, [data])

  if (!data || data.length === 0) {
    return <EmptyState />
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <XAxis dataKey="month" stroke="#94a3b8" />
        <YAxis 
          domain={[minValue, maxValue]} 
          tickFormatter={formatter} 
          stroke="#94a3b8" 
        />
        <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
        <Line type="monotone" dataKey="savings" stroke="#22c55e" strokeWidth={2} dot />
      </LineChart>
    </ResponsiveContainer>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
      Not enough data to display savings trends.
    </div>
  )
}

