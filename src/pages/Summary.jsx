import PageHeader from '../components/PageHeader.jsx'
import SavingsTrendChart from '../components/charts/SavingsTrendChart.jsx'
import TopCategoriesChart from '../components/charts/TopCategoriesChart.jsx'
import { useFinance } from '../context/FinanceContext.jsx'
import { formatCurrency } from '../utils/format.js'

export default function Summary() {
  const { transactions, totals, monthlyExpenseTrends, spendingByCategory } = useFinance()

  const monthlySavings = buildMonthlySavings(transactions)
  const topCategories = Object.entries(spendingByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)

  const totalTransactions = transactions.length
  const averageExpense =
    monthlyExpenseTrends.length > 0
      ? monthlyExpenseTrends.reduce((sum, item) => sum + item.total, 0) / monthlyExpenseTrends.length
      : 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Summary & Insights"
        description="Understand patterns, savings, and focus areas to make better financial decisions."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InsightCard label="Net Balance" value={formatCurrency(totals.balance)} />
        <InsightCard label="Total Transactions" value={totalTransactions} />
        <InsightCard
          label="Average Monthly Expense"
          value={formatCurrency(Math.round(averageExpense))}
        />
        <InsightCard
          label="Expense Categories"
          value={Object.keys(spendingByCategory).length}
          caption="Active categories"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Savings Trend</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Compare your monthly income versus expenses to see how savings evolve.
          </p>
          <div className="mt-4">
            <SavingsTrendChart data={monthlySavings} />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Top Spending Categories
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Identify where you spend the most to prioritize optimisations.
          </p>
          <div className="mt-4">
            <TopCategoriesChart data={topCategories} />
          </div>
        </div>
      </section>
    </div>
  )
}

function InsightCard({ label, value, caption }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
      {caption ? <p className="text-xs text-slate-400 dark:text-slate-500">{caption}</p> : null}
    </div>
  )
}

function buildMonthlySavings(transactions) {
  const grouped = new Map()

  transactions.forEach((txn) => {
    const month = txn.date?.slice(0, 7)
    if (!month) return
    if (!grouped.has(month)) {
      grouped.set(month, { income: 0, expense: 0 })
    }
    const bucket = grouped.get(month)
    if (txn.type === 'income') {
      bucket.income += Number(txn.amount || 0)
    } else if (txn.type === 'expense') {
      bucket.expense += Number(txn.amount || 0)
    }
  })

  return Array.from(grouped.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([month, { income, expense }]) => ({
      month,
      savings: income - expense,
    }))
}

