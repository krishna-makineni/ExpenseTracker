import axios from 'axios'

// Base URL for JSON-Server
const API_BASE_URL = 'http://localhost:3001'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
})

// Add response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Re-throw the error so it can be handled by individual API calls
    return Promise.reject(error)
  }
)

// Transactions API
export const transactionsAPI = {
  // GET all transactions
  getAll: async () => {
    const response = await api.get('/transactions')
    return response.data
  },

  // GET transaction by ID
  getById: async (id) => {
    const response = await api.get(`/transactions/${id}`)
    return response.data
  },

  // POST create new transaction
  create: async (transaction) => {
    const response = await api.post('/transactions', transaction)
    return response.data
  },

  // PUT update transaction
  update: async (id, transaction) => {
    const response = await api.put(`/transactions/${id}`, transaction)
    return response.data
  },

  // PATCH partial update transaction
  patch: async (id, updates) => {
    const response = await api.patch(`/transactions/${id}`, updates)
    return response.data
  },

  // DELETE transaction
  delete: async (id) => {
    await api.delete(`/transactions/${id}`)
    return id
  },
}

// Budgets API
export const budgetsAPI = {
  // GET all budgets
  getAll: async () => {
    const response = await api.get('/budgets')
    return response.data
  },

  // GET budget by ID
  getById: async (id) => {
    const response = await api.get(`/budgets/${id}`)
    return response.data
  },

  // GET budget by category
  getByCategory: async (category) => {
    const response = await api.get('/budgets', {
      params: { category },
    })
    return response.data.find((b) => b.category === category)
  },

  // POST create new budget
  create: async (budget) => {
    const response = await api.post('/budgets', budget)
    return response.data
  },

  // PUT update budget
  update: async (id, budget) => {
    const response = await api.put(`/budgets/${id}`, budget)
    return response.data
  },

  // PATCH partial update budget
  patch: async (id, updates) => {
    const response = await api.patch(`/budgets/${id}`, updates)
    return response.data
  },

  // DELETE budget
  delete: async (id) => {
    await api.delete(`/budgets/${id}`)
    return id
  },
}

// Users API (for authentication)
export const usersAPI = {
  // GET all users
  getAll: async () => {
    const response = await api.get('/users')
    return response.data
  },

  // GET user by email
  getByEmail: async (email) => {
    const response = await api.get('/users', {
      params: { email },
    })
    return response.data.find((u) => u.email === email)
  },

  // POST create new user
  create: async (user) => {
    const response = await api.post('/users', user)
    return response.data
  },

  // PUT update user
  update: async (id, user) => {
    const response = await api.put(`/users/${id}`, user)
    return response.data
  },

  // DELETE user
  delete: async (id) => {
    await api.delete(`/users/${id}`)
    return id
  },
}

export default api

