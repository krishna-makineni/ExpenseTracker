import { useEffect, useState } from 'react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, TRANSACTION_TYPES } from '../constants.js'
import { formatCurrency } from '../utils/format.js'

const initialFormState = {
  date: '',
  type: 'expense',
  category: '',
  amount: '',
  notes: '',
}

export default function TransactionModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(initialFormState)

  useEffect(() => {
    if (initialData) {
      setForm({
        date: initialData.date ?? '',
        type: initialData.type ?? 'expense',
        category: initialData.category ?? '',
        amount: initialData.amount ?? '',
        notes: initialData.notes ?? '',
      })
    } else {
      setForm(initialFormState)
    }
  }, [initialData, open])

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.date || !form.category || !form.amount) {
      return
    }
    onSubmit({
      ...initialData,
      ...form,
      amount: Number(form.amount),
    })
    onClose()
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {initialData ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {form.amount ? formatCurrency(form.amount) : 'Provide the transaction details below'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-300">
              Date
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-300">
              Type
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {TRANSACTION_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-300">
              Category
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                required
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-300">
              Amount (₹)
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                min="0"
                step="100"
                className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                required
              />
            </label>
          </div>
          <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-300">
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="3"
              className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Optional details to remember later"
            />
          </label>
          <div className="flex items-center justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              {initialData ? 'Save changes' : 'Add transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

