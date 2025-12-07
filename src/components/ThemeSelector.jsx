import { useState, useEffect, useRef } from 'react'
import { useFinance } from '../context/FinanceContext.jsx'

const themes = [
  { name: 'Light', value: 'light', colors: ['#ffffff', '#f3f4f6', '#1f2937'] },
  { name: 'Dark', value: 'dark', colors: ['#0f172a', '#1e293b', '#f1f5f9'] },
  { name: 'Cupcake', value: 'cupcake', colors: ['#fef7f7', '#fce7f3', '#a78bfa'] },
  { name: 'Bumblebee', value: 'bumblebee', colors: ['#fef3c7', '#fde68a', '#f59e0b'] },
  { name: 'Emerald', value: 'emerald', colors: ['#d1fae5', '#a7f3d0', '#059669'] },
  { name: 'Corporate', value: 'corporate', colors: ['#f8fafc', '#e2e8f0', '#475569'] },
  { name: 'Synthwave', value: 'synthwave', colors: ['#1a103d', '#2d1b4e', '#ff00ff'] },
  { name: 'Retro', value: 'retro', colors: ['#fef3c7', '#fde68a', '#92400e'] },
  { name: 'Cyberpunk', value: 'cyberpunk', colors: ['#1a1a2e', '#16213e', '#00ffff'] },
  { name: 'Valentine', value: 'valentine', colors: ['#fef2f2', '#fecdd3', '#ec4899'] },
  { name: 'Halloween', value: 'halloween', colors: ['#1c1917', '#292524', '#f97316'] },
  { name: 'Garden', value: 'garden', colors: ['#f0fdf4', '#bbf7d0', '#16a34a'] },
  { name: 'Forest', value: 'forest', colors: ['#0c0a09', '#1c1917', '#22c55e'] },
  { name: 'Aqua', value: 'aqua', colors: ['#ecfeff', '#a5f3fc', '#06b6d4'] },
  { name: 'LoFi', value: 'lofi', colors: ['#fafafa', '#f5f5f5', '#737373'] },
  { name: 'Pastel', value: 'pastel', colors: ['#fef3c7', '#fce7f3', '#f0abfc'] },
  { name: 'Fantasy', value: 'fantasy', colors: ['#fef3c7', '#fde68a', '#a78bfa'] },
  { name: 'Wireframe', value: 'wireframe', colors: ['#ffffff', '#e5e7eb', '#000000'] },
  { name: 'Black', value: 'black', colors: ['#000000', '#1a1a1a', '#ffffff'] },
  { name: 'Luxury', value: 'luxury', colors: ['#1c1917', '#292524', '#d4af37'] },
  { name: 'Dracula', value: 'dracula', colors: ['#282a36', '#44475a', '#bd93f9'] },
  { name: 'Cmyk', value: 'cmyk', colors: ['#ffffff', '#f0f0f0', '#000000'] },
  { name: 'Autumn', value: 'autumn', colors: ['#fff7ed', '#fed7aa', '#ea580c'] },
  { name: 'Business', value: 'business', colors: ['#1e293b', '#334155', '#cbd5e1'] },
  { name: 'Acid', value: 'acid', colors: ['#fef3c7', '#fde68a', '#84cc16'] },
  { name: 'Lemonade', value: 'lemonade', colors: ['#fffbeb', '#fef3c7', '#eab308'] },
  { name: 'Night', value: 'night', colors: ['#0f172a', '#1e293b', '#cbd5e1'] },
  { name: 'Coffee', value: 'coffee', colors: ['#3c2414', '#5c4033', '#d4a574'] },
  { name: 'Winter', value: 'winter', colors: ['#ffffff', '#f1f5f9', '#0f172a'] },
  { name: 'Dim', value: 'dim', colors: ['#1e293b', '#334155', '#cbd5e1'] },
  { name: 'Nord', value: 'nord', colors: ['#2e3440', '#3b4252', '#d8dee9'] },
  { name: 'Sunset', value: 'sunset', colors: ['#fff7ed', '#fed7aa', '#f97316'] },
]

export default function ThemeSelector() {
  const { settings, setTheme } = useFinance()
  const [isOpen, setIsOpen] = useState(false)
  const currentTheme = settings?.theme || 'light'
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleThemeChange = (themeValue) => {
    setTheme(themeValue)
    setIsOpen(false)
    
    // Immediately apply theme to DOM for instant feedback
    const root = document.documentElement
    root.setAttribute('data-theme', themeValue)
    
    // Handle dark mode
    const darkThemes = ['dark', 'synthwave', 'cyberpunk', 'halloween', 'forest', 'black', 'dracula', 'business', 'night', 'coffee', 'dim', 'nord']
    if (darkThemes.includes(themeValue)) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Force browser to recalculate styles
    void root.offsetHeight
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        title="Change theme"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
        <span className="hidden sm:inline">Theme</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Theme</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Choose a theme</p>
            </div>
            <div className="max-h-80 overflow-y-auto pr-1">
              <div className="grid grid-cols-4 gap-1.5">
                {themes.map((theme) => (
                  <button
                    key={theme.value}
                    type="button"
                    onClick={() => handleThemeChange(theme.value)}
                    className={`group relative flex flex-col items-center gap-1 rounded-lg border-2 p-1.5 transition hover:scale-105 ${
                      currentTheme === theme.value
                        ? 'border-purple-500 bg-purple-50 dark:border-purple-400 dark:bg-purple-900/20'
                        : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
                    }`}
                    title={theme.name}
                  >
                    <div className="flex gap-0.5">
                      {theme.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-[10px] font-medium leading-tight ${
                        currentTheme === theme.value
                          ? 'text-purple-700 dark:text-purple-300'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {theme.name}
                    </span>
                    {currentTheme === theme.value && (
                      <div className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-white">
                        <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
        </div>
      )}
    </div>
  )
}

