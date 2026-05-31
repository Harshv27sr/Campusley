// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, BookOpen, Download, Star, TrendingUp, FileText, Plus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import StatCard from '../components/ui/StatCard'
import NoteCard from '../components/notes/NoteCard'
import { NoteCardSkeleton } from '../components/ui/Skeleton'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import { useAuth } from '../context/AuthContext'
import { timeAgo } from '../utils/helpers'
import { notesService } from '../services/notesService'

const recentActivity = [
  { text: 'A student downloaded your DBMS notes', time: '10 mins ago', icon: '⬇️' },
  { text: 'A class peer rated your Electrostatics notes ⭐ 5 stars', time: '45 mins ago', icon: '⭐' },
  { text: 'Your uploaded CBSE Class 10 math cheat sheet was published', time: '2 hours ago', icon: '✅' },
  { text: '4 new downloads registered on your Quadratic Equations guide', time: '4 hours ago', icon: '📈' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const data = await notesService.getNotes()
        const uId = user?._id?.toString()
        // Filter uploaded documents by active user
        const userNotes = data.filter(n => n.uploader?._id?.toString() === uId || n.uploader?.toString() === uId)
        setUploads(userNotes)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const totalUploads = uploads.length
  const totalDownloads = uploads.reduce((acc, curr) => acc + (curr.downloadsCount || 0), 0)
  const totalBookmarks = user?.bookmarks?.length || 0
  const avgRating = uploads.length > 0 
    ? (uploads.reduce((acc, curr) => acc + (curr.averageRating || 0), 0) / uploads.length).toFixed(1)
    : '0.0'

  const stats = [
    { label: 'Total Uploads', value: totalUploads.toString(), icon: Upload, color: 'blue' },
    { label: 'Total Downloads', value: totalDownloads.toLocaleString(), icon: Download, color: 'green' },
    { label: 'Bookmarks Saved', value: totalBookmarks.toString(), icon: BookOpen, color: 'purple' },
    { label: 'Avg. Rating', value: avgRating, icon: Star, color: 'yellow' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 sm:p-8 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar src={user?.avatar} name={user?.name} size="xl" className="ring-4 ring-white/30" />
              <div>
                <p className="text-blue-200 text-sm font-medium">Welcome back 👋</p>
                <h1 className="text-2xl font-bold text-white font-display">
                  {user?.name || 'Student'}
                </h1>
                <p className="text-blue-200 text-sm mt-0.5">
                  {user?.educationLevel === 'School' ? (
                    `${user?.className || 'Class'} • ${user?.board || 'Board'} • ${user?.schoolName || 'School'}`
                  ) : (
                    `${user?.branch || 'Branch'} • Sem ${user?.semester || '1st'} • ${user?.college || 'Your College'}`
                  )}
                </p>
              </div>
            </div>
            <Link to="/upload">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-lg hover:shadow-xl transition-all whitespace-nowrap">
                <Plus size={16} /> Upload Notes
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Uploads */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Uploads</h2>
              <Link to="/profile" className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => <NoteCardSkeleton key={i} />)
              ) : uploads.length > 0 ? (
                uploads.slice(0, 4).map(note => (
                  <NoteCard key={note._id} note={note} />
                ))
              ) : (
                <div className="sm:col-span-2 text-center p-6 border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 text-sm flex flex-col items-center justify-center min-h-[160px]">
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">No uploads found</p>
                  <p className="text-xs text-slate-400">Your uploaded files will appear here.</p>
                </div>
              )}
              {/* Upload CTA */}
              <Link to="/upload">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="h-full min-h-[240px] border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 flex items-center justify-center transition-all">
                    <Plus size={22} />
                  </div>
                  <p className="font-semibold text-sm">Upload New Notes</p>
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-500" /> Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="text-lg flex-shrink-0">{a.icon}</span>
                    <div>
                      <p className="text-slate-700 dark:text-slate-300 leading-snug">{a.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badge Progress */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">🏆 Your Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="yellow">🚀 First Upload</Badge>
                <Badge variant="blue">📚 5 Uploads</Badge>
                <Badge variant="green">⭐ Top Rated</Badge>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                  <span>Next: Top Contributor</span>
                  <span>8/10 uploads</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                  <div className="h-2 w-4/5 rounded-full gradient-primary" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { to: '/upload', icon: '📤', label: 'Upload Notes' },
                  { to: '/explore', icon: '🔍', label: 'Explore Notes' },
                  { to: '/bookmarks', icon: '🔖', label: 'My Bookmarks' },
                  { to: '/papers', icon: '📄', label: 'PYQ Papers' },
                ].map(({ to, icon, label }) => (
                  <Link key={to} to={to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-medium text-slate-700 dark:text-slate-300">
                    <span className="text-lg">{icon}</span>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
