// src/routes/ProtectedRoute.jsx
import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error('Please log in or sign up to continue! 🔒', { id: 'auth-redirect-toast' })
    }
  }, [isAuthenticated, loading])

  if (loading) return <LoadingSpinner fullScreen />
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />

  // Gatekeeper: Redirect unverified or rejected accounts to pending verification lobby
  if (user?.verificationStatus === 'Pending' || user?.verificationStatus === 'Rejected') {
    if (location.pathname === '/verify-pending') {
      return children
    }
    return <Navigate to="/verify-pending" replace />
  }

  // If user is verified and attempts to access the pending page, send them back to dashboard
  if (user?.verificationStatus === 'Verified' && location.pathname === '/verify-pending') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
