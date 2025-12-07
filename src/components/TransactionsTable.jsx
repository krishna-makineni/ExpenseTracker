import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, TRANSACTION_TYPES, CATEGORY_EMOJI } from '../constants.js'
import { formatCurrency, formatDate } from '../utils/format.js'

const allCategories = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map((c) => c.name))]

export default function TransactionsTable({ transactions, onEdit, onDelete }) {
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    search: '',
  })

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      if (filters.type !== 'all' && txn.type !== filters.type) {
        return false
      }
      if (filters.category !== 'all' && txn.category !== filters.category) {
        return false
      }
      if (filters.search) {
        const query = filters.search.toLowerCase()
        return (
          txn.notes?.toLowerCase().includes(query) ||
          txn.category?.toLowerCase().includes(query) ||
          txn.type.toLowerCase().includes(query)
        )
      }
      return true
    })
  }, [transactions, filters])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <select
            value={filters.type}
            onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="all">All types</option>
            {TRANSACTION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <select
            value={filters.category}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, category: event.target.value }))
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="all">All categories</option>
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="search"
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
            placeholder="Search notes..."
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>
      <div className="max-h-[60vh] overflow-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="text-slate-700 dark:text-slate-200">
                <td className="px-4 py-3">{formatDate(transaction.date)}</td>
                <td className="px-4 py-3 capitalize">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      transaction.type === 'income'
                        ? 'bg-success/10 text-success'
                        : 'bg-danger/10 text-danger'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="mr-1">{CATEGORY_EMOJI[transaction.category] ?? ''}</span>
                  {transaction.category}
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {transaction.notes || '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(transaction)}
                      className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this transaction?')) {
                          try {
                            await onDelete(transaction.id)
                            toast.success('Transaction deleted successfully!', {
                              icon: '🗑️',
                            })
                          } catch (error) {
                            console.error('Failed to delete transaction:', error)
                            if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
                              toast.error('Cannot connect to server. Please start JSON-Server.', {
                                icon: '⚠️',
                              })
                            } else {
                              toast.error('Failed to delete transaction. Please try again.', {
                                icon: '✕',
                              })
                            }
                          }
                        }
                      }}
                      className="rounded-lg border border-danger/30 px-3 py-1 text-xs font-medium text-danger hover:bg-danger/10"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  No transactions found for the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

