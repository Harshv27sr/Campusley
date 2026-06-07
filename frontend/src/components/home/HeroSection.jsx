import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function HeroSection() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleUploadClick = () => {
    if (isAuthenticated) {
      navigate('/upload')
    } else {
      navigate('/login', { state: { from: { pathname: '/upload' } } })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark-surface pt-20">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 text-center w-full">
        {/* Announcement badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-card border border-warning/20 text-warning text-sm font-medium mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
          Now Live for Indian Students
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display leading-[1.1] mb-6 tracking-tight text-white"
        >
          Study Smarter with the<br className="hidden sm:block" />
          <span className="gradient-primary bg-clip-text text-transparent"> Ultimate Campus Network</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-dark-muted mb-10 leading-relaxed max-w-3xl mx-auto"
        >
          Access verified study notes, previous year papers, and get instant help from our Triple-AI Tutor. Built exclusively for Indian college and school students.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <Link to="/signup">
            <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
              Join the Community
              <ArrowRight size={16} />
            </button>
          </Link>
          <Link to="/explore">
            <button className="bg-dark-surface border border-dark-border hover:bg-dark-card text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all w-full sm:w-auto">
              Explore Resources
            </button>
          </Link>
        </motion.div>

        {/* Features Checklist */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-dark-muted"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-success" />
            <span>AI Verified Users</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-success" />
            <span>100% Free Resources</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}