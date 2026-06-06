// src/components/home/HeroSection.jsx
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Upload, Compass, Sparkles, BookOpen, Users, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const floatingCards = [
  { icon: '📄', label: 'Data Structures Notes', sub: '2.3k downloads', iconBg: 'bg-blue-50', delay: 0 },
  { icon: '📊', label: 'Machine Learning PYQ', sub: '1.8k downloads', iconBg: 'bg-purple-50', delay: 0.15 },
  { icon: '📝', label: 'OS Important Ques', sub: '3.1k downloads', iconBg: 'bg-orange-50', delay: 0.3 },
]

export default function HeroSection() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [stats, setStats] = useState({ totalNotes: 0, totalStudents: 0, totalColleges: 0 })

  useEffect(() => {
    api.get('/auth/public/stats')
      .then(res => setStats(res.data))
      .catch(() => {})
  }, [])

  const handleUploadClick = () => {
    if (isAuthenticated) {
      navigate('/upload')
    } else {
      navigate('/login', { state: { from: { pathname: '/upload' } } })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Subtle background dot pattern */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'radial-gradient(circle, #1A73E8 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      {/* Very subtle blue blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-50 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-50 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 py-24 lg:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            {/* Announcement badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-[#1A73E8] text-sm font-semibold mb-8"
            >
              <Sparkles size={14} className="text-[#1A73E8]" />
              AI-Powered Study Platform
              <span className="px-1.5 py-0.5 rounded-full bg-[#1A73E8] text-white text-xs">New</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display text-gray-900 leading-[1.1] mb-6"
            >
              Your Smart{' '}
              <span className="gradient-text">Campus</span>
              {' '}Learning Platform
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-500 mb-10 leading-relaxed max-w-lg"
            >
              Upload, discover, and share academic resources with students across your campus.
              Notes, PYQ papers, assignments — all in one place.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link to="/explore">
                <Button variant="gradient" size="lg" icon={<Compass size={20} />} iconRight={<ArrowRight size={18} />}>
                  Explore Notes
                </Button>
              </Link>
              <Button variant="outline" size="lg" icon={<Upload size={18} />} onClick={handleUploadClick}>
                Upload Notes
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-8"
            >
              {[
                { icon: BookOpen, value: stats.totalNotes > 0 ? `${stats.totalNotes.toLocaleString()}+` : '50K+', label: 'Notes Shared' },
                { icon: Users, value: stats.totalStudents > 0 ? `${stats.totalStudents.toLocaleString()}+` : '10K+', label: 'Students' },
                { icon: TrendingUp, value: stats.totalColleges > 0 ? `${stats.totalColleges}+` : '500+', label: 'Colleges' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Icon size={16} className="text-[#1A73E8]" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">{value}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Subtle background glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 rounded-full bg-blue-50 blur-3xl" />
            </div>

            {/* Main card */}
            <div className="relative bg-white rounded-3xl p-6 shadow-lg border border-gray-200 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1A73E8] flex items-center justify-center shadow-md">
                  <BookOpen size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Study Materials Hub</h3>
                  <p className="text-sm text-gray-500">4,300+ resources uploaded this week</p>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full mb-2">
                <div className="h-2 w-4/5 rounded-full bg-[#1A73E8]" />
              </div>
              <p className="text-xs text-gray-400">Quality Score: 96%</p>
            </div>

            {/* Floating mini cards */}
            {floatingCards.map((card, i) => (
              <motion.div
                key={card.label}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5 + i * 0.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: card.delay }}
                className={`absolute bg-white rounded-2xl p-3.5 shadow-lg border border-gray-200 flex items-center gap-3 z-20 whitespace-nowrap
                  ${i === 0 ? '-left-16 -top-10' : i === 1 ? '-right-16 top-14' : '-left-8 -bottom-12'}`}
              >
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center text-xl`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 max-w-[120px] truncate">{card.label}</p>
                  <p className="text-xs text-gray-400">{card.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
