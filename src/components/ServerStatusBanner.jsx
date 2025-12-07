import { useState, useEffect } from 'react'
import api from '../services/api.js'

export default function ServerStatusBanner() {
  const [isServerOnline, setIsServerOnline] = useState(true)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        // Try to ping the server with a simple GET request
        await api.get('/transactions', { timeout: 2000 })
        setIsServerOnline(true)
      } catch (error) {
        // If connection refused or network error, server is offline
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
          setIsServerOnline(false)
        } else {
          // Other errors might mean server is online but returned an error
          setIsServerOnline(true)
        }
      } finally {
        setIsChecking(false)
      }
    }

    // Check immediately
    checkServerStatus()

    // Check every 10 seconds
    const interval = setInterval(checkServerStatus, 10000)

    return () => clearInterval(interval)
  }, [])

  if (isChecking || isServerOnline) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 px-4 py-3 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            className="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="font-semibold">JSON-Server is not running</p>
            <p className="text-sm text-red-100">
              Please start the server by running <code className="rounded bg-red-700 px-1.5 py-0.5">npm run server</code> in a terminal
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

