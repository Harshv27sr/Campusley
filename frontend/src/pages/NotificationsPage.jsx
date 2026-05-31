// src/pages/NotificationsPage.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Download, Star, CheckCircle, Heart, Shield, Check } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { userService } from '../services/userService'
import { timeAgo } from '../utils/helpers'
import toast from 'react-hot-toast'

const TYPE_META = {
  download: { icon: Download, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  rating:   { icon: Star,     color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  like:     { icon: Heart,    color: 'text-red-500',   bg: 'bg-red-50 dark:bg-red-900/20' },
  approved: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  admin:    { icon: Shield,   color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
}

// If backend returns no notifications, show a friendly default set
const WELCOME_NOTIF = [
  { _id: 'w1', type: 'admin', text: '🎉 Welcome to Campusly! Your account is set up.', createdAt: new Date().toISOString(), read: false },
  { _id: 'w2', type: 'approved', text: '✅ Your account has been verified. Start uploading!', createdAt: new Date().toISOString(), read: false },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifs = async () => {
      setLoading(true)
      try {
        const data = await userService.getNotifications()
        setNotifications(data?.length ? data : WELCOME_NOTIF)
      } catch {
        setNotifications(WELCOME_NOTIF)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifs()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markRead = (id) =>
    setNotifications(p => p.map(n => n._id === id || n.id === id ? { ...n, read: true } : n))

  const markAllRead = async () => {
    try {
      await userService.markAllNotificationsRead()
      setNotifications(p => p.map(n => ({ ...n, read: true })))
      toast.success('All notifications marked as read')
    } catch {
      setNotifications(p => p.map(n => ({ ...n, read: true })))
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Bell className="text-blue-500" size={22} /> Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:underline"
            >
              <Check size={15} /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n, i) => {
              const meta = TYPE_META[n.type] || TYPE_META.admin
              const Icon = meta.icon
              const id = n._id || n.id
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => markRead(id)}
                  className={`flex gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md
                    ${n.read
                      ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.bg}`}>
                    <Icon size={18} className={meta.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${n.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white font-medium'}`}>
                      {n.text || n.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{timeAgo(n.createdAt || n.time)}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />}
                </motion.div>
              )
            })}
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Bell size={48} className="mx-auto mb-4 opacity-30" />
            <p>No notifications yet</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
