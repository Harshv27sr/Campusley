// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken()
      const savedUser = authService.getCurrentUser()
      if (token && savedUser) {
        setUser(savedUser)
        setIsAuthenticated(true)
        // Verify token with server
        try {
          const res = await authService.getMe()
          setUser(res.user)
          localStorage.setItem('campusly_user', JSON.stringify(res.user))
        } catch {
          logout()
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials)
    setUser(res.user)
    setIsAuthenticated(true)
    return res
  }, [])

  const googleLogin = useCallback(async (token, mode = 'login') => {
    const res = await authService.googleAuth(token || 'mock-google-token', mode)
    setUser(res.user)
    setIsAuthenticated(true)
    return res
  }, [])

  const signup = useCallback(async (data) => {
    const res = await authService.signup(data)
    if (res.token) {
      localStorage.setItem('campusly_token', res.token)
      localStorage.setItem('campusly_user', JSON.stringify(res.user))
      setUser(res.user)
      setIsAuthenticated(true)
    }
    return res
  }, [])

  const logout = useCallback(async () => {
    try { await authService.logout() } catch { /* ignore */ }
    localStorage.removeItem('campusly_token')
    localStorage.removeItem('campusly_user')
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
  }, [])

  const updateUser = useCallback((newData) => {
    setUser(prev => {
      const updatedUser = { ...prev, ...newData };
      localStorage.setItem('campusly_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    googleLogin,
    signup,
    logout,
    updateUser,
    isAdmin: user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
