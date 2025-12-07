import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CATEGORY_EMOJI } from '../../constants.js'

const chartColors = [
  '#2563eb',
  '#f97316',
  '#22c55e',
  '#ef4444',
  '#8b5cf6',
  '#14b8a6',
  '#f59e0b',
  '#ec4899',
  '#6366f1',
  '#0ea5e9',
]

export default function ExpenseCategoryChart({ data }) {
  const entries = Object.entries(data ?? {})
  const pieData =
    entries.length === 0
      ? []
      : entries.map(([category, value], index) => ({
          name: `${CATEGORY_EMOJI[category] ?? ''} ${category}`,
          value,
          fill: chartColors[index % chartColors.length],
        }))

  if (pieData.length === 0) {
    return <EmptyState />
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          dataKey="value"
          data={pieData}
          outerRadius="80%"
          innerRadius="50%"
          paddingAngle={4}
          stroke="transparent"
        >
          {pieData.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
      </PieChart>
    </ResponsiveContainer>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
      Not enough data to render this chart yet.
    </div>
  )
}

