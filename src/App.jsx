import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ServerStatusBanner from './components/ServerStatusBanner.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Transactions from './pages/Transactions.jsx'
import Budgets from './pages/Budgets.jsx'
import Summary from './pages/Summary.jsx'
import Settings from './pages/Settings.jsx'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'

export default function App() {
  return (
    <>
      <ServerStatusBanner />
      <Routes>
      <Route index element={<Home />} />
      <Route path="signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="summary" element={<Summary />} />
        <Route path="settings" element={<Settings />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
