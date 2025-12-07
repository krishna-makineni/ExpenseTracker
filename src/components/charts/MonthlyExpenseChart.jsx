import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function MonthlyExpenseChart({ data }) {
  const { maxValue, formatter } = useMemo(() => {
    if (!data || data.length === 0) {
      return { maxValue: 0, formatter: (v) => `₹${v}` }
    }
    const max = Math.max(...data.map((d) => d.total || 0))
    const roundedMax = Math.ceil(max * 1.1) // Add 10% padding
    
    // Choose appropriate formatter based on value range
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

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" stroke="#94a3b8" />
        <YAxis 
          domain={[0, maxValue]} 
          tickFormatter={formatter} 
          stroke="#94a3b8" 
        />
        <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#2563eb"
          fillOpacity={1}
          fill="url(#colorExpense)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
      Start tracking expenses to view monthly trends.
    </div>
  )
}

