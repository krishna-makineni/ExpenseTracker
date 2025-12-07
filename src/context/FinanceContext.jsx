import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { transactionsAPI, budgetsAPI } from '../services/api.js'

const defaultTransactions = []
const defaultBudgets = []

function createDefaultState() {
  return {
    transactions: [...defaultTransactions],
    budgets: [...defaultBudgets],
    settings: {
      theme: 'light',
    },
  }
}

const FinanceContext = createContext(null)

const actionTypes = {
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  UPSERT_BUDGET: 'UPSERT_BUDGET',
  DELETE_BUDGET: 'DELETE_BUDGET',
  SET_THEME: 'SET_THEME',
  RESET_ALL: 'RESET_ALL',
  LOAD_STATE: 'LOAD_STATE',
  SET_LOADING: 'SET_LOADING',
}

function financeReducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_TRANSACTION: {
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      }
    }
    case actionTypes.UPDATE_TRANSACTION: {
      return {
        ...state,
        transactions: state.transactions.map((txn) =>
          txn.id === action.payload.id ? { ...txn, ...action.payload } : txn,
        ),
      }
    }
    case actionTypes.DELETE_TRANSACTION: {
      return {
        ...state,
        transactions: state.transactions.filter((txn) => txn.id !== action.payload.id),
      }
    }
    case actionTypes.UPSERT_BUDGET: {
      const existing = state.budgets.find((budget) => budget.category === action.payload.category)
      if (existing) {
        return {
          ...state,
          budgets: state.budgets.map((budget) =>
            budget.category === action.payload.category
              ? { ...budget, limit: action.payload.limit }
              : budget,
          ),
        }
      }

      return {
        ...state,
        budgets: [...state.budgets, { ...action.payload, id: action.payload.id || generateId('b') }],
      }
    }
    case actionTypes.DELETE_BUDGET: {
      return {
        ...state,
        budgets: state.budgets.filter((budget) => budget.id !== action.payload.id),
      }
    }
    case actionTypes.SET_THEME: {
      return {
        ...state,
        settings: {
          ...state.settings,
          theme: action.payload.theme,
        },
      }
    }
    case actionTypes.RESET_ALL: {
      return createDefaultState()
    }
    case actionTypes.LOAD_STATE: {
      return action.payload
    }
    case actionTypes.SET_LOADING: {
      return {
        ...state,
        loading: action.payload,
      }
    }
    default:
      return state
  }
}

function generateId(prefix) {
  return `${prefix}-${window.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`
}

// Helper to load settings from localStorage (theme preference can stay local)
function loadSettings() {
  try {
    const stored = localStorage.getItem('finance-tracker-settings')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to parse settings from storage', error)
  }
  return { theme: 'light' }
}

function saveSettings(settings) {
  try {
    localStorage.setItem('finance-tracker-settings', JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save settings', error)
  }
}

export function FinanceProvider({ children }) {
  const { currentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [state, dispatch] = useReducer(financeReducer, {
    ...createDefaultState(),
    settings: loadSettings(),
  })

  // Load data from API when user changes
  useEffect(() => {
    const loadData = async () => {
      if (!currentUser?.email) {
        dispatch({ type: actionTypes.RESET_ALL })
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        // Load transactions filtered by userId
        const allTransactions = await transactionsAPI.getAll()
        const userTransactions = allTransactions.filter((t) => t.userId === currentUser.email) || []

        // Load budgets filtered by userId
        const allBudgets = await budgetsAPI.getAll()
        const userBudgets = allBudgets.filter((b) => b.userId === currentUser.email) || []

        dispatch({
          type: actionTypes.LOAD_STATE,
          payload: {
            transactions: userTransactions,
            budgets: userBudgets,
            settings: loadSettings(),
          },
        })
      } catch (error) {
        // Only log non-connection errors (connection refused is expected if server isn't running)
        if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
          console.error('Failed to load finance data from API', error)
        }
        // Fallback to empty state if API fails
        dispatch({
          type: actionTypes.LOAD_STATE,
          payload: {
            transactions: [],
            budgets: [],
            settings: loadSettings(),
          },
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [currentUser?.email])

  // Apply theme whenever it changes or on initial load
  useEffect(() => {
    const root = document.documentElement
    const theme = state.settings?.theme || 'light'

    // Set data-theme attribute for theme switching
    root.setAttribute('data-theme', theme)

    // Handle dark mode class for themes that are dark
    const darkThemes = [
      'dark',
      'synthwave',
      'cyberpunk',
      'halloween',
      'forest',
      'black',
      'dracula',
      'business',
      'night',
      'coffee',
      'dim',
      'nord',
    ]
    if (darkThemes.includes(theme)) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Force a repaint to ensure theme is applied
    requestAnimationFrame(() => {
      root.style.setProperty('--theme-bg', getComputedStyle(root).getPropertyValue('--theme-bg'))
      root.style.setProperty(
        '--theme-surface',
        getComputedStyle(root).getPropertyValue('--theme-surface'),
      )
      root.style.setProperty('--theme-text', getComputedStyle(root).getPropertyValue('--theme-text'))
    })

    // Save settings to localStorage
    if (state.settings) {
      saveSettings(state.settings)
    }
  }, [state.settings?.theme])

  const totals = useMemo(() => {
    const income = state.transactions
      .filter((txn) => txn.type === 'income')
      .reduce((sum, txn) => sum + Number(txn.amount || 0), 0)
    const expenses = state.transactions
      .filter((txn) => txn.type === 'expense')
      .reduce((sum, txn) => sum + Number(txn.amount || 0), 0)
    return {
      income,
      expenses,
      balance: income - expenses,
    }
  }, [state.transactions])

  const spendingByCategory = useMemo(() => {
    return state.transactions
      .filter((txn) => txn.type === 'expense')
      .reduce((acc, txn) => {
        acc[txn.category] = (acc[txn.category] ?? 0) + Number(txn.amount || 0)
        return acc
      }, {})
  }, [state.transactions])

  const monthlyExpenseTrends = useMemo(() => {
    const grouped = {}
    state.transactions.forEach((txn) => {
      if (txn.type !== 'expense') return
      const month = txn.date?.slice(0, 7) ?? 'Unknown'
      grouped[month] = (grouped[month] ?? 0) + Number(txn.amount || 0)
    })

    return Object.entries(grouped)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([month, total]) => ({
        month,
        total,
      }))
  }, [state.transactions])

  const budgetProgress = useMemo(() => {
    return state.budgets.map((budget) => {
      const spent = state.transactions
        .filter((txn) => txn.type === 'expense' && txn.category === budget.category)
        .reduce((sum, txn) => sum + Number(txn.amount || 0), 0)
      const percentage = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 999) : 0
      return { ...budget, spent, percentage }
    })
  }, [state.budgets, state.transactions])

  const value = useMemo(
    () => ({
      transactions: state.transactions,
      budgets: state.budgets,
      settings: state.settings,
      totals,
      spendingByCategory,
      monthlyExpenseTrends,
      budgetProgress,
      isLoading,
      addTransaction: async (transaction) => {
        if (!currentUser?.email) return
        const id = generateId('t')
        const newTransaction = {
          ...transaction,
          id,
          userId: currentUser.email,
        }
        try {
          await transactionsAPI.create(newTransaction)
          dispatch({
            type: actionTypes.ADD_TRANSACTION,
            payload: newTransaction,
          })
        } catch (error) {
          // Only log non-connection errors
          if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
            console.error('Failed to create transaction', error)
          }
          throw error
        }
      },
      updateTransaction: async (transaction) => {
        if (!currentUser?.email) return
        try {
          await transactionsAPI.update(transaction.id, transaction)
          dispatch({ type: actionTypes.UPDATE_TRANSACTION, payload: transaction })
        } catch (error) {
          // Only log non-connection errors
          if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
            console.error('Failed to update transaction', error)
          }
          throw error
        }
      },
      deleteTransaction: async (id) => {
        if (!currentUser?.email) return
        try {
          await transactionsAPI.delete(id)
          dispatch({ type: actionTypes.DELETE_TRANSACTION, payload: { id } })
        } catch (error) {
          // Only log non-connection errors
          if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
            console.error('Failed to delete transaction', error)
          }
          throw error
        }
      },
      upsertBudget: async (category, limit) => {
        if (!currentUser?.email) return
        try {
          const existing = state.budgets.find((budget) => budget.category === category)
          if (existing) {
            const updatedBudget = { ...existing, limit, userId: currentUser.email }
            await budgetsAPI.update(existing.id, updatedBudget)
            dispatch({
              type: actionTypes.UPSERT_BUDGET,
              payload: updatedBudget,
            })
          } else {
            const newBudget = {
              category,
              limit,
              userId: currentUser.email,
              id: generateId('b'),
            }
            const created = await budgetsAPI.create(newBudget)
            dispatch({
              type: actionTypes.UPSERT_BUDGET,
              payload: created,
            })
          }
        } catch (error) {
          // Only log non-connection errors
          if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
            console.error('Failed to upsert budget', error)
          }
          throw error
        }
      },
      deleteBudget: async (id) => {
        if (!currentUser?.email) return
        try {
          await budgetsAPI.delete(id)
          dispatch({ type: actionTypes.DELETE_BUDGET, payload: { id } })
        } catch (error) {
          // Only log non-connection errors
          if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
            console.error('Failed to delete budget', error)
          }
          throw error
        }
      },
      setTheme: (theme) => {
        dispatch({ type: actionTypes.SET_THEME, payload: { theme } })
      },
      resetAll: async () => {
        if (!currentUser?.email) return
        try {
          // Delete all user's transactions
          const userTransactions = state.transactions.filter((t) => t.userId === currentUser.email)
          await Promise.all(userTransactions.map((t) => transactionsAPI.delete(t.id)))

          // Delete all user's budgets
          const userBudgets = state.budgets.filter((b) => b.userId === currentUser.email)
          await Promise.all(userBudgets.map((b) => budgetsAPI.delete(b.id)))

          dispatch({ type: actionTypes.RESET_ALL })
        } catch (error) {
          // Only log non-connection errors
          if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
            console.error('Failed to reset all data', error)
          }
          throw error
        }
      },
    }),
    [
      state.transactions,
      state.budgets,
      state.settings,
      totals,
      spendingByCategory,
      monthlyExpenseTrends,
      budgetProgress,
      isLoading,
      currentUser?.email,
    ],
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFinance() {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
