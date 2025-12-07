import { useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import BudgetProgress from '../components/BudgetProgress.jsx'
import PageHeader from '../components/PageHeader.jsx'
import AISuggestions from '../components/AISuggestions.jsx'
import { EXPENSE_CATEGORIES } from '../constants.js'
import { useFinance } from '../context/FinanceContext.jsx'
import { formatCurrency } from '../utils/format.js'

export default function Budgets() {
  const { upsertBudget, budgetProgress } = useFinance()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAIAdvisor, setShowAIAdvisor] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [form, setForm] = useState({
    category: '',
    limit: '',
  })

  // Calculate overall budget summary
  const overallSummary = useMemo(() => {
    const totalBudget = budgetProgress.reduce((sum, budget) => sum + budget.limit, 0)
    const totalSpent = budgetProgress.reduce((sum, budget) => sum + budget.spent, 0)
    const remaining = Math.max(totalBudget - totalSpent, 0)
    const usage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
    return { totalBudget, totalSpent, remaining, usage }
  }, [budgetProgress])

  const handleOpenModal = (budget = null) => {
    if (budget) {
      setEditingBudget(budget)
      setForm({ category: budget.category, limit: budget.limit.toString() })
    } else {
      setEditingBudget(null)
      setForm({ category: '', limit: '' })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBudget(null)
    setForm({ category: '', limit: '' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.category || !form.limit) {
      toast.warning('Please fill in all fields', {
        icon: '⚠️',
      })
      return
    }
    try {
      await upsertBudget(form.category, Number(form.limit))
      toast.success(
        editingBudget ? 'Budget updated successfully!' : 'Budget created successfully!',
        {
          icon: '💰',
        }
      )
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save budget:', error)
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        toast.error('Cannot connect to server. Please start JSON-Server.', {
          icon: '⚠️',
        })
      } else {
        toast.error('Failed to save budget. Please try again.', {
          icon: '✕',
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budgets"
        description="Set smart spending limits to stay disciplined throughout the month."
      />

      {/* Overall Budget Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Overall Budget Summary</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Budget</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
              {formatCurrency(overallSummary.totalBudget)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Spent</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
              {formatCurrency(overallSummary.totalSpent)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Remaining</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
              {formatCurrency(overallSummary.remaining)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Usage</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
              {overallSummary.usage.toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              overallSummary.usage > 100 ? 'bg-red-500' : overallSummary.usage > 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(overallSummary.usage, 100)}%` }}
          />
        </div>
      </div>

      {/* Category Budgets */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Category Budgets</h3>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAIAdvisor(!showAIAdvisor)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-purple-700 hover:to-indigo-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              {showAIAdvisor ? 'Hide AI Advisor' : 'Ask AI Advisor'}
            </button>
            <button
              type="button"
              onClick={() => handleOpenModal()}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
            >
              + Create Budget
            </button>
          </div>
        </div>
        <BudgetProgress onEdit={handleOpenModal} />
      </div>

      {/* AI Suggestions */}
      {showAIAdvisor && <AISuggestions />}

      {/* Budget Tips */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950/30">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <svg
              className="h-5 w-5 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Budget Tips</h4>
              <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
              </svg>
            </div>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Set realistic budgets based on your historical spending patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Create category-specific budgets for better control</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Review and adjust your budgets monthly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Enable email alerts to get notified when approaching limits</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {editingBudget ? 'Edit Budget' : 'Create Budget'}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-300">
          Category
          <select
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            required
                  disabled={!!editingBudget}
          >
            <option value="" disabled>
              Select expense category
            </option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-300">
          Monthly limit (₹)
          <input
            type="number"
            value={form.limit}
            onChange={(event) => setForm((prev) => ({ ...prev, limit: event.target.value }))}
            min="0"
            step="500"
            className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            required
          />
        </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
          <button
            type="submit"
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
                  {editingBudget ? 'Update' : 'Create'} Budget
          </button>
        </div>
      </form>
          </div>
        </div>
      )}
    </div>
  )
}

