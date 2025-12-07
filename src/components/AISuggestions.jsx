import { useState, useEffect } from 'react'
import { useFinance } from '../context/FinanceContext.jsx'
import { formatCurrency } from '../utils/format.js'

const API_KEY_STORAGE_KEY = 'openai_api_key'

export default function AISuggestions() {
  const { budgetProgress, totals, spendingByCategory, transactions } = useFinance()
  const [apiKey, setApiKey] = useState('')
  const [userRequest, setUserRequest] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)

  useEffect(() => {
    // Load API key from localStorage
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY)
    if (storedKey) {
      setApiKey(storedKey)
    } else {
      // Check for environment variable
      const envKey = import.meta.env.VITE_OPENAI_API_KEY
      if (envKey) {
        setApiKey(envKey)
      } else {
        setShowApiKeyInput(true)
      }
    }
  }, [])

  const prepareFinancialData = () => {
    const totalBudget = budgetProgress.reduce((sum, budget) => sum + budget.limit, 0)
    const totalSpent = budgetProgress.reduce((sum, budget) => sum + budget.spent, 0)
    const budgetUsage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

    // Get recent transactions (last 10)
    const recentTransactions = transactions.slice(0, 10).map((txn) => ({
      type: txn.type,
      category: txn.category,
      amount: formatCurrency(txn.amount),
      date: txn.date,
      description: txn.description || 'No description',
    }))

    // Get budget details
    const budgetDetails = budgetProgress.map((budget) => ({
      category: budget.category,
      limit: formatCurrency(budget.limit),
      spent: formatCurrency(budget.spent),
      remaining: formatCurrency(Math.max(budget.limit - budget.spent, 0)),
      usage: `${budget.percentage.toFixed(1)}%`,
      status: budget.percentage > 100 ? 'Over Budget' : budget.percentage > 80 ? 'Warning' : 'On Track',
    }))

    // Get top spending categories
    const topCategories = Object.entries(spendingByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({
        category,
        amount: formatCurrency(amount),
        percentage: totals.expenses > 0 ? `${((amount / totals.expenses) * 100).toFixed(1)}%` : '0%',
      }))

    return {
      summary: {
        totalIncome: formatCurrency(totals.income),
        totalExpenses: formatCurrency(totals.expenses),
        balance: formatCurrency(totals.balance),
        savingsRate: totals.income > 0 ? `${((totals.balance / totals.income) * 100).toFixed(1)}%` : '0%',
      },
      budgets: {
        totalBudget: formatCurrency(totalBudget),
        totalSpent: formatCurrency(totalSpent),
        budgetUsage: `${budgetUsage.toFixed(1)}%`,
        budgetDetails,
      },
      spending: {
        topCategories,
        totalTransactions: transactions.length,
      },
      recentTransactions,
    }
  }

  const handleGetSuggestions = async () => {
    if (!apiKey) {
      setError('Please enter your OpenAI API key')
      setShowApiKeyInput(true)
      return
    }

    if (!userRequest.trim()) {
      setError('Please enter your question or request')
      return
    }

    setIsLoading(true)
    setError('')
    setAiResponse('')

    try {
      const financialData = prepareFinancialData()

      const prompt = `You are a financial advisor AI assistant. Analyze the following user's financial data and provide personalized advice based on their request.

USER'S FINANCIAL DATA:
${JSON.stringify(financialData, null, 2)}

USER'S REQUEST: "${userRequest}"

Please provide:
1. A clear analysis of their financial situation relevant to their request
2. Specific, actionable recommendations
3. Where to cut expenses (if applicable)
4. How to increase income (if applicable)
5. Steps to achieve their goal

Format your response in a clear, friendly, and professional manner. Use bullet points for recommendations. Be specific with amounts and categories when relevant.`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful financial advisor AI that provides personalized, actionable financial advice based on user data. Be specific, practical, and encouraging.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error?.message || `API error: ${response.statusText}`
        
        // Provide helpful guidance for common errors
        let helpfulMessage = errorMessage
        if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
          helpfulMessage = `Quota Exceeded: Your OpenAI API key has exceeded its quota or needs billing setup.\n\nTo fix this:\n1. Go to https://platform.openai.com/account/billing\n2. Add a payment method to your account\n3. Check your usage limits at https://platform.openai.com/usage\n\nIf you're on the free tier, you may need to upgrade to a paid plan.`
        } else if (errorMessage.includes('Invalid API key') || errorMessage.includes('authentication')) {
          helpfulMessage = `Invalid API Key: Please check that your API key is correct.\n\n1. Get a new key from https://platform.openai.com/api-keys\n2. Update your API key in the field above\n3. Make sure the key starts with "sk-"`
        } else if (errorMessage.includes('rate limit')) {
          helpfulMessage = `Rate Limit: Too many requests. Please wait a moment and try again.`
        }
        
        throw new Error(helpfulMessage)
      }

      const data = await response.json()
      const aiMessage = data.choices[0]?.message?.content || 'No response generated'

      setAiResponse(aiMessage)
    } catch (err) {
      setError(err.message || 'Failed to get AI suggestions. Please check your API key and try again.')
      console.error('AI API Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim())
      setShowApiKeyInput(false)
      setError('')
    } else {
      setError('Please enter a valid API key')
    }
  }

  const handleClearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY)
    setApiKey('')
    setShowApiKeyInput(true)
    setAiResponse('')
  }

  return (
    <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 dark:border-purple-800 dark:from-purple-950/30 dark:to-indigo-950/30">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">AI Financial Advisor</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">Get personalized financial advice</p>
        </div>
      </div>

      {/* API Key Input */}
      {showApiKeyInput && (
        <div className="mb-4 rounded-lg border border-purple-200 bg-white/70 p-4 dark:border-purple-800 dark:bg-slate-800/70">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            OpenAI API Key
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={handleSaveApiKey}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Save
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Your API key is stored locally and never shared. Get your key from{' '}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 underline hover:text-purple-700 dark:text-purple-400"
            >
              OpenAI Platform
            </a>
          </p>
        </div>
      )}

      {/* User Request Input */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          What would you like help with?
        </label>
        <textarea
          value={userRequest}
          onChange={(e) => setUserRequest(e.target.value)}
          placeholder="e.g., How can I save more money? Where should I cut expenses? How can I increase my income? I want to save ₹50,000 in 6 months..."
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:border-slate-700 dark:bg-white/70 dark:text-slate-100"
        />
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={handleGetSuggestions}
            disabled={isLoading || !apiKey || !userRequest.trim()}
            className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-purple-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Analyzing...
              </span>
            ) : (
              'Get AI Advice'
            )}
          </button>
          {userRequest && (
            <button
              type="button"
              onClick={() => {
                setUserRequest('')
                setAiResponse('')
                setError('')
              }}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="mb-2 text-sm font-semibold text-red-800 dark:text-red-300">Error</p>
              <div className="whitespace-pre-wrap text-sm text-red-700 dark:text-red-400">{error}</div>
              {error.includes('Quota Exceeded') && (
                <div className="mt-3 rounded-md bg-red-100 p-3 dark:bg-red-900/20">
                  <p className="mb-2 text-xs font-medium text-red-800 dark:text-red-300">Quick Links:</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://platform.openai.com/account/billing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700"
                    >
                      Add Payment Method
                    </a>
                    <a
                      href="https://platform.openai.com/usage"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-red-600 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      Check Usage
                    </a>
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-red-600 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      Manage API Keys
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Response */}
      {aiResponse && (
        <div className="rounded-lg border border-white/50 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </div>
            <h5 className="font-semibold text-slate-900 dark:text-white">AI Recommendations</h5>
          </div>
          <div className="prose prose-sm max-w-none text-slate-700 dark:prose-invert dark:text-slate-300">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{aiResponse}</div>
          </div>
        </div>
      )}

      {/* Quick Suggestions */}
      {!aiResponse && !isLoading && (
        <div className="rounded-lg border border-white/50 bg-white/70 p-4 dark:border-slate-700/50 dark:bg-slate-800/70">
          <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'How can I save more money?',
              'Where should I cut expenses?',
              'How to increase my income?',
              'Help me stick to my budget',
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setUserRequest(suggestion)}
                className="rounded-full border border-purple-200 bg-white px-3 py-1 text-xs text-slate-700 transition hover:bg-purple-50 dark:border-purple-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
