import { createContext, useContext, useState, useEffect } from 'react'
import { usersAPI } from '../services/api.js'

const AUTH_STORAGE_KEY = 'finance-tracker-auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const loadStoredAuth = async () => {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        try {
          const user = JSON.parse(stored)
          // Restore user immediately for better UX
          setCurrentUser({ name: user.name, email: user.email })
          
          // Verify user still exists in API (in background)
          try {
            const allUsers = await usersAPI.getAll()
            const foundUser = allUsers.find((u) => u.email === user.email)
            if (!foundUser) {
              // User doesn't exist in database, log them out
              setCurrentUser(null)
              localStorage.removeItem(AUTH_STORAGE_KEY)
            } else {
              // Update user data in case name changed
              setCurrentUser({ name: foundUser.name, email: foundUser.email })
            }
          } catch (error) {
            // Only log non-connection errors (connection refused is expected if server isn't running)
            if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
              console.error('Failed to verify user from API', error)
            }
            // Keep user logged in if API is unavailable (they're already restored above)
          }
        } catch {
          // Invalid stored auth, clear it
          localStorage.removeItem(AUTH_STORAGE_KEY)
          setCurrentUser(null)
        }
      }
      setIsLoading(false)
    }

    loadStoredAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const allUsers = await usersAPI.getAll()
      const user = allUsers.find((u) => u.email === email && u.password === password)
      if (user) {
        const userData = { name: user.name, email: user.email }
        setCurrentUser(userData)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
        return { success: true }
      }
      return { success: false, error: 'Invalid email or password' }
    } catch (error) {
      // Check if it's a connection error
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        return {
          success: false,
          error: 'Cannot connect to server. Please start JSON-Server by running: npm run server',
        }
      }
      console.error('Login failed', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const signup = async (name, email, password) => {
    try {
      // Check if user already exists
      const allUsers = await usersAPI.getAll()
      const existingUser = allUsers.find((u) => u.email === email)
      if (existingUser) {
        return { success: false, error: 'Email already registered' }
      }

      // Create new user
      const newUser = { name, email, password }
      const createdUser = await usersAPI.create(newUser)
      
      // Use the created user data (JSON-Server adds an id)
      const userData = { name: createdUser.name, email: createdUser.email }
      setCurrentUser(userData)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      // Check if it's a connection error
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        return {
          success: false,
          error: 'Cannot connect to server. Please start JSON-Server by running: npm run server',
        }
      }
      // Log the full error for debugging
      console.error('Signup failed:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      })
      
      // Provide more specific error messages
      if (error.response?.status === 400) {
        return { success: false, error: 'Invalid user data. Please check your inputs.' }
      }
      if (error.response?.status === 500) {
        return { success: false, error: 'Server error. Please try again later.' }
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to create account. Please try again.' 
      }
    }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
