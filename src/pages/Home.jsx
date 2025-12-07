import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion as M } from 'framer-motion'
import { IconWallet, IconCurrencyRupee, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'
import { useAuth } from '../context/AuthContext.jsx'

const demoStats = [
  { label: 'Income', value: '₹1,20,000', change: '+18%' },
  { label: 'Expenses', value: '₹74,500', change: '-6%' },
  { label: 'Savings', value: '₹45,500', change: '+24%' },
]

const demoChart = [
  { month: 'Jan', income: 45, expense: 28 },
  { month: 'Feb', income: 50, expense: 21 },
  { month: 'Mar', income: 68, expense: 42 },
  { month: 'Apr', income: 72, expense: 45 },
  { month: 'May', income: 60, expense: 34 },
  { month: 'Jun', income: 82, expense: 51 },
]

export default function Home() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const maxBarValue = demoChart.reduce(
    (max, item) => Math.max(max, item.income, item.expense),
    0,
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const result = await login(form.email, form.password)
      if (result.success) {
        toast.success('Welcome back! Logged in successfully.', {
          icon: '👋',
        })
        navigate('/dashboard', { replace: true })
      } else {
        setError(result.error || 'Invalid email or password')
        toast.error(result.error || 'Invalid email or password', {
          icon: '✕',
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Failed to login. Please try again.')
      toast.error('Failed to login. Please try again.', {
        icon: '✕',
      })
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-600/10 via-fuchsia-500/10 to-pink-500/10 dark:from-indigo-900/30 dark:via-fuchsia-900/20 dark:to-pink-900/20">
      {/* Animated gradient orbs */}
      <M.div
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-pink-500 opacity-40 blur-3xl"
        initial={{ scale: 0.8, opacity: 0.25 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse' }}
      />
      <M.div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-500 to-indigo-500 opacity-30 blur-3xl"
        initial={{ scale: 1, opacity: 0.25 }}
        animate={{ scale: 1.1, opacity: 0.35 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
        <M.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md rounded-3xl border border-white/20 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/60"
        >
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <IconWallet size={16} />
              FinanceFlow
            </span>
            <h1 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Track every rupee with holistic insights. Log in to continue your journey.
            </p>
          </div>
          {error ? (
            <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
              {error}
            </div>
          ) : null}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Email Address
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-white/30 bg-white/70 px-4 py-3 text-sm text-slate-900 shadow-sm backdrop-blur focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
              />
            </label>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-white/30 bg-white/70 px-4 py-3 text-sm text-slate-900 shadow-sm backdrop-blur focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-primary/30 transition hover:shadow-xl"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </M.div>

        <div className="relative mt-16 flex-1 lg:mt-0">
          <M.div
            className="absolute inset-0 -z-10 translate-x-12 rounded-[3rem] bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/30 to-pink-500/30 blur-3xl"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 1.2 }}
          />
          <div className="relative grid gap-6">
            <M.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full max-w-xl rounded-3xl bg-white/70 p-6 shadow-2xl backdrop-blur-xl dark:bg-slate-900/60"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Track your Income & Expenses
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                    ₹4,30,000
                  </p>
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-md ring-2 ring-white/20">
                  <IconTrendingUp size={22} />
                </span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {demoStats.map((stat) => {
                  const icon =
                    stat.label === 'Income'
                      ? <IconCurrencyRupee className="text-emerald-500" size={18} />
                      : stat.label === 'Expenses'
                        ? <IconTrendingDown className="text-rose-500" size={18} />
                        : <IconWallet className="text-indigo-500" size={18} />
                  return (
                    <M.div
                      key={stat.label}
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                      className="rounded-2xl border border-white/40 bg-gradient-to-br from-white/60 to-white/30 p-4 text-sm shadow-sm backdrop-blur dark:border-slate-700/60 dark:from-slate-800/50 dark:to-slate-800/30"
                    >
                      <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {icon}
                        {stat.label}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs font-medium text-emerald-500">{stat.change}</p>
                    </M.div>
                  )
                })}
              </div>
            </M.div>

            <M.div
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-xl rounded-3xl border border-white/40 bg-white/60 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    All Transactions
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    2nd Jan to 21st Dec
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-primary/30 px-4 py-1 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  View More
                </button>
              </div>
              <div className="mt-6 grid grid-cols-6 gap-4">
                {demoChart.map((item) => {
                  const incomeHeight = maxBarValue
                    ? Math.max((item.income / maxBarValue) * 100, 12)
                    : 0
                  const expenseHeight = maxBarValue
                    ? Math.max((item.expense / maxBarValue) * 100, 10)
                    : 0
                  return (
                    <div key={item.month} className="flex flex-col items-center gap-2">
                      <M.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex h-36 w-16 items-end justify-center gap-2 rounded-full bg-slate-100 p-2 dark:bg-slate-800"
                      >
                        <M.span
                          className="w-4 rounded-full bg-fuchsia-400"
                          initial={{ height: 0 }}
                          animate={{ height: `${expenseHeight}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          title={`Expense: ${item.expense}`}
                        />
                        <M.span
                          className="w-4 rounded-full bg-indigo-500"
                          initial={{ height: 0 }}
                          animate={{ height: `${incomeHeight}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          title={`Income: ${item.income}`}
                        />
                      </M.div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {item.month}
                      </span>
                    </div>
                  )
                })}
              </div>
            </M.div>
          </div>
        </div>
      </div>
    </div>
  )
}

