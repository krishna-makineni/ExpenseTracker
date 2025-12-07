import { Link, NavLink, Outlet } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext.jsx'

const navigation = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Transactions', path: '/transactions' },
  { name: 'Budgets', path: '/budgets' },
  { name: 'Summary', path: '/summary' },
  { name: 'Settings', path: '/settings' },
]

export default function Layout() {
  const { totals } = useFinance()

  return (
    <div className="flex min-h-screen bg-muted dark:bg-slate-900">
      <aside className="hidden w-64 flex-col justify-between border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 lg:flex">
        <div>
          <div className="mb-8">
            <Link to="/" className="text-2xl font-bold text-primary hover:opacity-90">FinanceFlow</Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track your income, spending, and savings with ease.
            </p>
          </div>
          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                  ].join(' ')
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="font-semibold text-slate-700 dark:text-slate-200">Current Balance</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            ₹{totals.balance.toLocaleString('en-IN')}
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Keep making mindful spending decisions to stay on track.
          </p>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="text-xl font-semibold text-primary hover:opacity-90">FinanceFlow</Link>
              <p className="text-xs text-slate-500 dark:text-slate-400">Stay on top of your money.</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Balance ₹{totals.balance.toLocaleString('en-IN')}
            </span>
          </div>
          <nav className="mt-4 flex flex-wrap gap-2">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
                  ].join(' ')
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

