import StatCard from '../components/StatCard.jsx'
import PageHeader from '../components/PageHeader.jsx'
import ExpenseCategoryChart from '../components/charts/ExpenseCategoryChart.jsx'
import MonthlyExpenseChart from '../components/charts/MonthlyExpenseChart.jsx'
import { useFinance } from '../context/FinanceContext.jsx'
import { formatCurrency, formatDate } from '../utils/format.js'
import { CATEGORY_EMOJI } from '../constants.js'

export default function Dashboard() {
  const { totals, spendingByCategory, monthlyExpenseTrends, transactions } = useFinance()

  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Snapshot of your personal finances with insights on income, expenses, and savings."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Income"
          value={formatCurrency(totals.income)}
          caption="All credits counted"
          accent="success"
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency(totals.expenses)}
          caption="Spending so far"
          accent="danger"
        />
        <StatCard
          label="Balance"
          value={formatCurrency(totals.balance)}
          caption={totals.balance >= 0 ? 'Healthy balance' : 'Over budget'}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Expense Categories
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Understand where your money goes most frequently.
          </p>
          <div className="mt-4">
            <ExpenseCategoryChart data={spendingByCategory} />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Monthly Expense Trend
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track how your spending evolves over time.
          </p>
          <div className="mt-4">
            <MonthlyExpenseChart data={monthlyExpenseTrends} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Last 5 transactions
          </span>
        </div>
        <div className="mt-4 divide-y divide-slate-200 text-sm dark:divide-slate-800">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  <span className="mr-1">{CATEGORY_EMOJI[transaction.category] ?? ''}</span>
                  {transaction.category}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(transaction.date)} • {transaction.notes || 'No notes'}
                </p>
              </div>
              <span
                className={`text-base font-semibold ${
                  transaction.type === 'income' ? 'text-success' : 'text-danger'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          ))}
          {recentTransactions.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No transactions recorded yet. Add one to start tracking.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  )
}

