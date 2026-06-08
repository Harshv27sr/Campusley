import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../../services/api'

export default function AuthLayout({ children, title, subtitle }) {
  const [stats, setStats] = useState([
    { value: '...', label: 'Notes Shared' },
    { value: '...', label: 'Students' },
    { value: '...', label: 'Colleges' },
    { value: '...', label: 'Schools' },
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/auth/public/stats')
        const data = res.data
        setStats([
          { value: data.notes + '+', label: 'Notes Shared' },
          { value: data.students + '+', label: 'Students' },
          { value: data.colleges + '+', label: 'Colleges' },
          { value: data.schools + '+', label: 'Schools' },
        ])
      } catch (err) {
        console.error('Failed to load public stats')
        // Fallback to static numbers if API fails
        setStats([
          { value: '50K+', label: 'Notes Shared' },
          { value: '10K+', label: 'Students' },
          { value: '500+', label: 'Colleges' },
          { value: '300+', label: 'Schools' },
        ])
      }
    }
    fetchStats()
  }, [])
  return (
    <div className="min-h-screen flex bg-dark-surface text-white">
      {/* Left Panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-dark-card border-r border-dark-border">
        <div className="absolute inset-0 opacity-10">
          {/* Grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white font-display">Campusley</span>
          </Link>

          {/* Centered Glassmorphic Presentation Card */}
          <div className="my-auto max-w-lg bg-dark-elevated rounded-2xl p-8 border border-dark-border shadow-2xl relative overflow-hidden group">
            {/* Glowing ambient light backgrounds */}
            <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-primary/20 blur-3xl transition-all duration-700 pointer-events-none" />
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative z-10"
            >
              <h1 className="text-4xl font-bold text-white mb-4 font-display leading-tight">
                Your Smart Campus<br />Learning Platform
              </h1>
              <p className="text-dark-muted text-base mb-8">
                Join thousands of students sharing notes, papers, and study materials.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {stats.map((s) => (
                  <div 
                    key={s.label} 
                    className="bg-dark-surface rounded-xl py-3.5 px-2.5 text-center border border-dark-border transition-all duration-300"
                  >
                    <div className="text-xl sm:text-2xl font-black text-white">{s.value}</div>
                    <div className="text-dark-muted text-[10px] sm:text-xs font-semibold mt-0.5 truncate">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <p className="text-dark-muted text-sm">© {new Date().getFullYear()} Campusley. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel — form */}
      <div className="flex-1 flex flex-col bg-dark-surface">
        <div className="flex items-center justify-between py-4 px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-bold text-white font-display">Campusley</span>
          </Link>
          <div className="ml-auto">
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 shadow-2xl"
          >
            {(title || subtitle) && (
              <div className="mb-6">
                {title && <h2 className="text-2xl font-bold text-white font-display mb-1.5">{title}</h2>}
                {subtitle && <p className="text-sm text-dark-muted">{subtitle}</p>}
              </div>
            )}
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
