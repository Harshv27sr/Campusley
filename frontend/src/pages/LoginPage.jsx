// src/pages/LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, googleLogin } = useAuth()
  const from = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      await login(form)
      toast.success('Welcome back! 🎉')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    console.log("Campusly Google Client ID loaded:", clientId)
    if (!clientId || clientId.includes("YOUR_GOOGLE_CLIENT_ID_HERE") || clientId === "your_google_client_id") {
      toast.error(`Google Client ID is not configured! (Current value: "${clientId}"). Please add VITE_GOOGLE_CLIENT_ID in your frontend .env file and restart your Vite dev server in your terminal.`)
      return
    }

    if (!window.google) {
      toast.error("Google Sign-In library is loading. Please try again in a moment.")
      return
    }

    setLoading(true)

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "email profile openid",
        callback: async (response) => {
          if (response.error) {
            setLoading(false)
            toast.error("Google Authentication failed or canceled.")
            return
          }
          if (response.access_token) {
            try {
              await googleLogin(response.access_token, 'login')
              toast.success('Successfully logged in with Google! 🚀')
              navigate(from, { replace: true })
            } catch (err) {
              const status = err.response?.status
              const msg = err.response?.data?.message || 'Google Sign-in failed.'
              if (status === 404) {
                toast.error(msg, { duration: 5000, icon: '🚫' })
              } else {
                toast.error(msg)
              }
            } finally {
              setLoading(false)
            }
          } else {
            setLoading(false)
          }
        },
        error_callback: (err) => {
          setLoading(false)
          toast.error("Google login error: " + err.message)
        }
      })
      client.requestAccessToken()
    } catch (err) {
      setLoading(false)
      toast.error("Failed to initialize Google Sign-in client.")
    }
  }

  return (
    <AuthLayout title="Welcome back 👋" subtitle="Log in to continue your learning journey">
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        {/* Dummy inputs to absorb browser autofill on load */}
        <input type="text" name="email" className="sr-only" tabIndex={-1} aria-hidden="true" autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} />
        <input type="password" name="password" className="sr-only" tabIndex={-1} aria-hidden="true" autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} />

        <Input
          label="Email address"
          type="email"
          icon={Mail}
          placeholder="you@university.edu"
          value={form.email}
          onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
          error={errors.email}
          required
          preventAutofill
          autoComplete="new-password"
        />
        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
          error={errors.password}
          required
          preventAutofill
          autoComplete="new-password"
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600" />
            <span className="text-slate-600 dark:text-slate-400">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="gradient" size="lg" loading={loading} className="w-full" iconRight={<ArrowRight size={18} />}>
          Log In
        </Button>

        {/* Divider */}
        <div className="relative flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs text-slate-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Sign up free
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
