import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import PageHeader from '../components/PageHeader.jsx'
import { useFinance } from '../context/FinanceContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Settings() {
  const { settings, setTheme, resetAll } = useFinance()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)

  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    toast.info(`Theme changed to ${newTheme === 'dark' ? 'dark' : 'light'} mode`, {
      icon: newTheme === 'dark' ? '🌙' : '🌞',
    })
  }

  const handleReset = async () => {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 4000)
      return
    }
    try {
      await resetAll()
      setConfirming(false)
      toast.success('All data has been cleared successfully!', {
        icon: '🗑️',
      })
    } catch (error) {
      console.error('Failed to reset all data:', error)
      setConfirming(false)
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        toast.error('Cannot connect to server. Please start JSON-Server.', {
          icon: '⚠️',
        })
      } else {
        toast.error('Failed to clear data. Please try again.', {
          icon: '✕',
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Control appearance and manage your stored finance data."
        action={
          <button
            type="button"
            onClick={() => {
              toast.info('Logged out successfully. See you soon!', {
                icon: '👋',
              })
              logout()
              navigate('/', { replace: true })
            }}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            title="Log out"
          >
            Log out
          </button>
        }
      />

      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Switch between light and dark themes.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <span className="text-lg">{settings.theme === 'dark' ? '🌙' : '🌞'}</span>
              <span>{settings.theme === 'dark' ? 'Use light mode' : 'Use dark mode'}</span>
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-danger/30 bg-white p-6 shadow-sm dark:border-danger/50 dark:bg-slate-950">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-danger">Danger zone</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Remove all transactions, budgets, and reset app settings.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${
                confirming ? 'bg-danger/80 hover:bg-danger/70' : 'bg-danger hover:bg-danger/90'
              }`}
            >
              {confirming ? 'Click again to confirm' : 'Clear all data'}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

