import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ShieldAlert, CheckCircle2, XCircle, LogOut, FileText, ExternalLink, ShieldCheck, HelpCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'

export default function VerifyPendingPage() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [simulatorAction, setSimulatorAction] = useState(null)

  const serverUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
  const idCardPreviewUrl = user?.idCardUrl ? `${serverUrl}${user.idCardUrl}` : null
  const isPdf = user?.idCardUrl?.toLowerCase().endsWith('.pdf')

  // Handle Simulated Admin Verification
  const handleSimulateVerification = async (status) => {
    setLoading(true)
    setSimulatorAction(status)
    try {
      const res = await authService.verifyAccount(status)
      
      if (status === 'Verified') {
        toast.success('Admin Simulator: Account approved! Welcome to Campusley 🎉', { duration: 5000 })
        updateUser(res.user)
        navigate('/dashboard', { replace: true })
      } else {
        toast.error('Admin Simulator: Account rejected. Verification status set to Rejected.', { duration: 5000 })
        updateUser(res.user)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification simulator error.')
    } finally {
      setLoading(false)
      setSimulatorAction(null)
    }
  }

  // Handle Logout to return to safety
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (err) {
      toast.error('Failed to log out.')
    }
  }

  const isRejected = user?.verificationStatus === 'Rejected'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse" />

      {/* Main Glassmorphic Lobby Card */}
      <div className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl rounded-3xl p-6 sm:p-8 space-y-6 relative">
        
        {/* Verification Status Header */}
        <div className="text-center space-y-3">
          {isRejected ? (
            <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 animate-bounce">
              <ShieldAlert size={36} />
            </div>
          ) : (
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 animate-pulse">
              <Clock size={36} />
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            {isRejected ? 'Academic Verification Rejected' : 'Verification in Progress'}
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {isRejected 
              ? 'Your submitted school/college ID card failed authenticity verification. Please contact support or re-register.'
              : 'Our administration team is currently verifying your school/college ID card to ensure you are a genuine student.'
            }
          </p>
        </div>

        {/* Student Details Grid */}
        <div className="bg-slate-950/50 border border-slate-800/60 rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">Student Name</span>
            <span className="text-sm font-semibold text-slate-200">{user?.name}</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">Email Address</span>
            <span className="text-sm font-semibold text-slate-200 truncate block">{user?.email}</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">Education Level</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {user?.educationLevel} Student
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">
              {user?.educationLevel === 'College' ? 'College & Branch' : 'School & Board'}
            </span>
            <span className="text-sm font-semibold text-slate-200 block truncate">
              {user?.educationLevel === 'College' 
                ? `${user?.college} (${user?.branch})`
                : `${user?.schoolName} (${user?.board})`
              }
            </span>
          </div>
        </div>

        {/* Uploaded ID Card Preview Segment */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <FileText size={16} className="text-slate-400" />
            Uploaded Credentials
          </h3>
          
          {idCardPreviewUrl ? (
            <div className="relative border border-slate-800/80 rounded-2xl bg-slate-950/80 p-3 overflow-hidden flex flex-col items-center justify-center min-h-[140px]">
              {isPdf ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-500 mx-auto">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Student ID Card (PDF)</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click link below to open document preview</p>
                  </div>
                  <a
                    href={idCardPreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 hover:underline transition-all bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/20 font-semibold"
                  >
                    Open ID Card in New Tab
                    <ExternalLink size={12} />
                  </a>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="max-w-xs max-h-[160px] overflow-hidden rounded-xl border border-slate-800/80 shadow-inner">
                    <img 
                      src={idCardPreviewUrl} 
                      alt="Uploaded Student ID" 
                      className="object-contain w-full max-h-[160px] rounded-xl hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <a 
                    href={idCardPreviewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold hover:underline"
                  >
                    Open Full Image
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-500 dark:text-slate-400 text-xs">
              No ID Card file detected.
            </div>
          )}
        </div>

        {/* Admin Sandbox Simulator (Developer Mode) */}
        <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <ShieldCheck size={20} />
            <h3 className="text-sm font-bold">Admin Sandbox Simulator (Developer Mode)</h3>
          </div>
          <p className="text-xs text-indigo-200/80 leading-relaxed">
            Since you are testing, you can bypass the manual review wait time using this sandbox controller.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="gradient"
              className="w-full justify-center"
              onClick={() => handleSimulateVerification('Verified')}
              disabled={loading}
            >
              {loading && simulatorAction === 'Verified' ? 'Approving...' : 'Simulate Approve Account'}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
              onClick={() => handleSimulateVerification('Rejected')}
              disabled={loading}
            >
              {loading && simulatorAction === 'Rejected' ? 'Rejecting...' : 'Simulate Reject Account'}
            </Button>
          </div>
        </div>

        {/* Global Action Footer */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck size={14} className="text-blue-500" />
            256-bit Encrypted Portal
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/40 hover:bg-slate-800 border border-slate-800/60 px-3.5 py-2 rounded-xl"
          >
            <LogOut size={14} />
            Log Out & Exit
          </button>
        </div>

      </div>
    </div>
  )
}
