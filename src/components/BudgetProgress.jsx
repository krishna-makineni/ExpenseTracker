import { useMemo } from 'react'
import { toast } from 'react-toastify'
import { useFinance } from '../context/FinanceContext.jsx'
import { formatCurrency } from '../utils/format.js'
import { CATEGORY_EMOJI } from '../constants.js'

export default function BudgetProgress({ onEdit }) {
  const { budgetProgress, deleteBudget } = useFinance()

  const sortedBudgets = useMemo(() => {
    // Separate "Overall Budget" if it exists, otherwise create one from all budgets
    const overall = budgetProgress.find((b) => b.category === 'Overall Budget')
    const others = budgetProgress.filter((b) => b.category !== 'Overall Budget')
    
    if (overall) {
      return [overall, ...others.sort((a, b) => a.category.localeCompare(b.category))]
    }
    return [...others.sort((a, b) => a.category.localeCompare(b.category))]
  }, [budgetProgress])

  const getStatus = (budget) => {
    const percentage = budget.percentage
    if (percentage > 100) return { label: 'Over Budget', color: 'red', icon: '⚠️' }
    if (percentage > 80) return { label: 'Warning', color: 'yellow', icon: '⚠️' }
    return { label: 'On Track', color: 'green', icon: '✓' }
  }

  const getHeaderColor = (budget) => {
    if (budget.category === 'Overall Budget') return 'bg-slate-700 dark:bg-slate-800'
    const status = getStatus(budget)
    if (status.color === 'yellow') return 'bg-orange-500 dark:bg-orange-600'
    if (status.color === 'red') return 'bg-red-500 dark:bg-red-600'
    return 'bg-slate-200 dark:bg-slate-700'
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sortedBudgets.map((budget) => {
        const remaining = Math.max(budget.limit - budget.spent, 0)
        const status = getStatus(budget)
        const progressColor =
          status.color === 'red'
            ? 'bg-red-500'
            : status.color === 'yellow'
              ? 'bg-yellow-500'
              : 'bg-green-500'

        return (
          <div
            key={budget.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
          >
            {/* Header with colored background */}
            <div className={`${getHeaderColor(budget)} px-5 py-3`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-semibold text-white">{budget.category}</h4>
                  <p className="text-xs text-white/80">Monthly Limit</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit?.(budget)}
                    className="rounded p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white"
                    title="Edit budget"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`Are you sure you want to delete the budget for ${budget.category}?`)) {
                        try {
                          await deleteBudget(budget.id)
                          toast.success('Budget deleted successfully!', {
                            icon: '🗑️',
                          })
                        } catch (error) {
                          console.error('Failed to delete budget:', error)
                          if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
                            toast.error('Cannot connect to server. Please start JSON-Server.', {
                              icon: '⚠️',
                            })
                          } else {
                            toast.error('Failed to delete budget. Please try again.', {
                              icon: '✕',
                            })
                          }
                        }
                      }
                    }}
                    className="rounded p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white"
                    title="Delete budget"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="mb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">Budget</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(budget.limit)}
                </p>
              </div>

              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600 dark:text-slate-400">Progress</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {budget.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full ${progressColor} transition-all duration-300`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Spent</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(budget.spent)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Remaining</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(remaining)}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    status.color === 'red'
                      ? 'bg-red-100 dark:bg-red-900/30'
                      : status.color === 'yellow'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30'
                        : 'bg-green-100 dark:bg-green-900/30'
                  }`}
                >
                  <span className="text-xs">{status.icon}</span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    status.color === 'red'
                      ? 'text-red-600 dark:text-red-400'
                      : status.color === 'yellow'
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-green-600 dark:text-green-400'
                  }`}
                >
                  {status.label}
                </span>
              </div>
            </div>
          </div>
        )
      })}
      {sortedBudgets.length === 0 ? (
        <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No budgets yet. Click "Create Budget" to add one.
        </div>
      ) : null}
    </div>
  )
}

