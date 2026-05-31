// src/pages/ForgotPasswordPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { authService } from '../services/authService'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { toast.error('Please enter your email'); return }
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title={sent ? 'Check your email ✉️' : 'Forgot Password?'} subtitle={sent ? `We sent a reset link to ${email}` : 'Enter your email and we\'ll send you a reset link'}>
      {sent ? (
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            Check your inbox and click the link to reset your password. The link expires in 1 hour.
          </p>
          <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
            Send again
          </Button>
          <Link to="/login" className="mt-4 flex items-center justify-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email address"
            type="email"
            icon={Mail}
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>
            Send Reset Link
          </Button>
          <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </form>
      )}
    </AuthLayout>
  )
}
