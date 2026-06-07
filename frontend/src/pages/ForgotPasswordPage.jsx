// src/pages/ForgotPasswordPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, Lock, Key, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { authService } from '../services/authService'

export default function ForgotPasswordPage() {
  const [method, setMethod] = useState('email') // 'email' or 'phone'
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [step, setStep] = useState(1) // 1: identifier, 2: verify otp, 3: set new password, 4: success
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!identifier) {
      toast.error(`Please enter your ${method === 'email' ? 'email address' : 'mobile number'}`)
      return
    }

    if (method === 'phone' && !/^\d{10}$/.test(identifier)) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }

    setLoading(true)
    try {
      const res = await authService.forgotPassword(identifier)
      toast.success(res.message || 'OTP code sent successfully!')
      
      // If server returned OTP (fallback developer mode), show it in a toast for easy copy
      if (res.otp) {
        toast(`[DEV ONLY] OTP is: ${res.otp}`, { icon: '🔑', duration: 15000 })
      }
      
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP code. Please verify details.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (!otp) {
      toast.error('Please enter the 6-digit OTP code')
      return
    }
    if (otp.length !== 6) {
      toast.error('OTP code must be 6 digits')
      return
    }

    setLoading(true)
    try {
      const res = await authService.verifyOTP(identifier, otp)
      toast.success(res.message || 'OTP verified successfully! 🎉')
      setStep(3)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed. Invalid or expired OTP.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!password) {
      toast.error('Please enter your new password')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await authService.resetPassword(identifier, otp, password)
      toast.success(res.message || 'Password reset successfully! 🎉')
      setStep(4)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout 
      title={
        step === 4 
          ? 'Password Reset! 🎉' 
          : step === 3 
            ? 'Set New Password' 
            : step === 2 
              ? 'Verify OTP Code' 
              : 'Forgot Password?'
      } 
      subtitle={
        step === 4 
          ? 'Your password has been updated successfully' 
          : step === 3
            ? 'Create a secure new password for your account'
            : step === 2 
              ? `Enter the 6-digit OTP code sent to your ${method === 'email' ? 'email' : 'mobile number'}` 
              : 'Recover your account using registered email or mobile number'
      }
    >
      {step === 4 && (
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            Your password has been successfully updated in our database. You can now use your new password to log in.
          </p>
          <Link to="/login" className="w-full">
            <Button variant="gradient" size="lg" className="w-full">
              Go to Login
            </Button>
          </Link>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            icon={Lock}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            icon={Lock}
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>
            Save New Password
          </Button>
          <button 
            type="button" 
            onClick={() => setStep(2)} 
            className="w-full text-center text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            Go Back
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <Input
            label="OTP Code (6 Digits)"
            type="text"
            icon={Key}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
            maxLength={6}
            required
          />
          <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>
            Verify OTP
          </Button>
          <button 
            type="button" 
            onClick={() => setStep(1)} 
            className="w-full text-center text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            Go Back
          </button>
        </form>
      )}

      {step === 1 && (
        <div className="space-y-5">
          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => { setMethod('email'); setIdentifier('') }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all
                ${method === 'email'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
            >
              <Mail size={15} />
              Via Email
            </button>
            <button
              type="button"
              onClick={() => { setMethod('phone'); setIdentifier('') }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all
                ${method === 'phone'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
            >
              <Phone size={15} />
              Via Mobile
            </button>
          </div>

          <form onSubmit={handleSendOTP} className="space-y-4">
            {method === 'email' ? (
              <Input
                label="Email address"
                type="email"
                icon={Mail}
                placeholder="you@university.edu"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            ) : (
              <Input
                label="Mobile Number"
                type="tel"
                icon={Phone}
                placeholder="9876543210"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, '').substring(0, 10))}
                required
              />
            )}
            <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>
              Send Verification OTP
            </Button>
            <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </form>
        </div>
      )}
    </AuthLayout>
  )
}
