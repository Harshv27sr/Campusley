// src/pages/AdminDashboardPage.jsx
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Users, FileText, Flag, TrendingUp, Ban, Trash2, CheckCircle, Eye, Download, Search, RefreshCw, Shield, Image as ImageIcon, X } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import StatCard from '../components/ui/StatCard'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import SearchBar from '../components/ui/SearchBar'
import { adminService } from '../services/userService'
import { timeAgo, formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'

const TABS = ['Overview', 'Users', 'Notes']

export default function AdminDashboardPage() {
  const [tab, setTab] = useState('Overview')
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [viewDocsUser, setViewDocsUser] = useState(null)

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await adminService.getStats()
      setStats(data)
    } catch (err) {
      console.error('Stats fetch error:', err)
    }
  }, [])

  // Fetch users
  const fetchUsers = useCallback(async (q = '') => {
    try {
      const data = await adminService.getUsers(q)
      setUsers(data)
    } catch (err) {
      console.error('Users fetch error:', err)
    }
  }, [])

  // Fetch notes
  const fetchNotes = useCallback(async () => {
    try {
      const data = await adminService.getNotes()
      setNotes(data)
    } catch (err) {
      console.error('Notes fetch error:', err)
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.all([fetchStats(), fetchUsers(), fetchNotes()])
      setLoading(false)
    }
    load()
  }, [fetchStats, fetchUsers, fetchNotes])

  // Debounce user search
  useEffect(() => {
    const t = setTimeout(() => fetchUsers(search), 300)
    return () => clearTimeout(t)
  }, [search, fetchUsers])

  const handleVerifyUser = async (userId, status) => {
    setActionLoading(userId + status)
    try {
      await adminService.verifyUser(userId, status)
      toast.success(`User ${status.toLowerCase()}!`)
      fetchUsers(search)
      fetchStats()
    } catch (err) {
      toast.error('Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return
    setActionLoading('del-' + userId)
    try {
      await adminService.deleteUser(userId)
      toast.success('User deleted')
      setUsers(p => p.filter(u => u._id !== userId))
      fetchStats()
    } catch {
      toast.error('Failed to delete user')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteNote = async (noteId, title) => {
    if (!window.confirm(`Delete note "${title}"?`)) return
    setActionLoading('dnote-' + noteId)
    try {
      await adminService.deleteNote(noteId)
      toast.success('Note deleted')
      setNotes(p => p.filter(n => n._id !== noteId))
      fetchStats()
    } catch {
      toast.error('Failed to delete note')
    } finally {
      setActionLoading(null)
    }
  }

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers?.toLocaleString() || '0', icon: Users, color: 'blue' },
    { label: 'Total Notes', value: stats.totalNotes?.toLocaleString() || '0', icon: FileText, color: 'green' },
    { label: 'Pending Verify', value: stats.pendingVerifications || '0', icon: Flag, color: 'red' },
    { label: 'Total Downloads', value: stats.totalDownloads >= 1000 ? `${(stats.totalDownloads / 1000).toFixed(1)}K` : (stats.totalDownloads || '0'), icon: TrendingUp, color: 'purple' },
  ] : []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Admin Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage users, content, and platform health</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="lg">🛡️ Admin</Badge>
            <button
              onClick={() => { fetchStats(); fetchUsers(search); fetchNotes() }}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <StatCard {...s} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Tab Nav */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {tab === 'Overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Recent Registrations</h3>
              {loading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />)}</div>
              ) : (
                <div className="space-y-3">
                  {users.slice(0, 5).map(u => (
                    <div key={u._id} className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar name={u.name} size="xs" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{u.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                        </div>
                      </div>
                      <Badge
                        variant={u.verificationStatus === 'Verified' ? 'green' : u.verificationStatus === 'Rejected' ? 'red' : 'yellow'}
                        size="sm"
                      >
                        {u.verificationStatus || 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Notes */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Recent Uploads</h3>
              {loading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />)}</div>
              ) : (
                <div className="space-y-3">
                  {notes.slice(0, 5).map(n => (
                    <div key={n._id} className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{n.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{n.uploader?.name} • {timeAgo(n.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Badge variant="blue" size="sm">{n.fileType}</Badge>
                        <button
                          onClick={() => handleDeleteNote(n._id, n.title)}
                          disabled={actionLoading === 'dnote-' + n._id}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                          title="Delete Note"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Users Tab ── */}
        {tab === 'Users' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 dark:text-white">All Users ({users.length})</h3>
              <SearchBar value={search} onChange={setSearch} onClear={() => setSearch('')} placeholder="Search users..." className="w-56" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {['User', 'Email', 'Level', 'Uploads', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left pb-3 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i}><td colSpan={6} className="py-3"><div className="h-8 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" /></td></tr>
                    ))
                  ) : users.map(u => (
                    <tr key={u._id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <Avatar name={u.name} size="xs" />
                          <div>
                            <span className="font-medium text-slate-900 dark:text-white">{u.name}</span>
                            {u.role === 'admin' && <span className="ml-1 text-xs text-purple-500">🛡️</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-slate-500 dark:text-slate-400 text-xs">{u.email}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={u.educationLevel === 'School' ? 'yellow' : 'blue'} size="sm">
                          {u.educationLevel || 'College'}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">{u.uploadCount || 0}</td>
                      <td className="py-3 pr-4">
                        <Badge
                          variant={u.verificationStatus === 'Verified' ? 'green' : u.verificationStatus === 'Rejected' ? 'red' : 'yellow'}
                          size="sm"
                        >
                          {u.verificationStatus || 'Pending'}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => setViewDocsUser(u)}
                            className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                            title="View ID Card & Selfie"
                          >
                            <ImageIcon size={14} />
                          </button>
                          {u.verificationStatus !== 'Verified' && (
                            <button
                              onClick={() => handleVerifyUser(u._id, 'Verified')}
                              disabled={!!actionLoading}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
                              title="Verify User"
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                          {u.verificationStatus !== 'Rejected' && (
                            <button
                              onClick={() => handleVerifyUser(u._id, 'Rejected')}
                              disabled={!!actionLoading}
                              className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                              title="Reject User"
                            >
                              <Ban size={14} />
                            </button>
                          )}
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(u._id, u.name)}
                              disabled={!!actionLoading}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                              title="Delete User"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loading && users.length === 0 && (
                <p className="text-center text-slate-400 py-8">No users found</p>
              )}
            </div>
          </div>
        )}

        {/* ── Notes Tab ── */}
        {tab === 'Notes' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-bold text-slate-900 dark:text-white mb-5">All Notes ({notes.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {['Title', 'Uploader', 'Type', 'Downloads', 'Date', 'Actions'].map(h => (
                      <th key={h} className="text-left pb-3 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i}><td colSpan={6} className="py-3"><div className="h-8 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" /></td></tr>
                    ))
                  ) : notes.map(n => (
                    <tr key={n._id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <td className="py-3 pr-4 max-w-xs">
                        <p className="font-medium text-slate-900 dark:text-white truncate">{n.title}</p>
                        <p className="text-xs text-slate-400 truncate">{n.college || n.schoolName || '—'}</p>
                      </td>
                      <td className="py-3 pr-4 text-slate-500 dark:text-slate-400 text-xs">{n.uploader?.name || '—'}</td>
                      <td className="py-3 pr-4"><Badge variant="blue" size="sm">{n.fileType}</Badge></td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">{n.downloadsCount || 0}</td>
                      <td className="py-3 pr-4 text-slate-500 dark:text-slate-400 text-xs">{formatDate(n.createdAt)}</td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDeleteNote(n._id, n.title)}
                          disabled={actionLoading === 'dnote-' + n._id}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                          title="Delete Note"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loading && notes.length === 0 && (
                <p className="text-center text-slate-400 py-8">No notes found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Docs Modal */}
      {viewDocsUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="text-blue-500" size={20} />
                Identity Verification: {viewDocsUser.name}
              </h3>
              <button onClick={() => setViewDocsUser(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700/50 rounded-full">
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              {viewDocsUser.verificationReason && (
                <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${viewDocsUser.verificationStatus === 'Rejected' ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'}`}>
                  <strong>AI Analysis:</strong> {viewDocsUser.verificationReason}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm flex items-center gap-1.5"><FileText size={16} className="text-blue-500"/> ID Card Document</h4>
                  <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    {viewDocsUser.idCardUrl && viewDocsUser.idCardUrl !== '/uploads/placeholder_id.png' ? (
                      <img src={`http://localhost:5000${viewDocsUser.idCardUrl}`} alt="ID Card" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-slate-400 text-sm">No Document</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm flex items-center gap-1.5"><User size={16} className="text-purple-500"/> Live Selfie</h4>
                  <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    {viewDocsUser.liveSelfieUrl ? (
                      <img src={`http://localhost:5000${viewDocsUser.liveSelfieUrl}`} alt="Selfie" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-slate-400 text-sm">No Selfie Uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => handleVerifyUser(viewDocsUser._id, 'Rejected')}>
                <Ban size={16} className="text-red-500 mr-2" /> Reject
              </Button>
              <Button variant="gradient" onClick={() => handleVerifyUser(viewDocsUser._id, 'Verified')}>
                <CheckCircle size={16} className="mr-2" /> Approve Genuine
              </Button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  )
}
