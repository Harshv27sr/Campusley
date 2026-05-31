// src/pages/SettingsPage.jsx
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Bell, Shield, Trash2, Camera, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '../components/layout/DashboardLayout'
import Input, { Textarea, Select } from '../components/ui/Input'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/userService'
import { BRANCHES, SEMESTERS, BOARDS, CLASSES } from '../utils/constants'

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Shield },
]

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [tab, setTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const fileInputRef = useRef(null)

  const [profile, setProfile] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    college: user?.college || '',
    branch: user?.branch || '',
    semester: user?.semester || '',
    schoolName: user?.schoolName || '',
    board: user?.board || '',
    className: user?.className || '',
  })

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [notifSettings, setNotifSettings] = useState({
    downloads: true, ratings: true, comments: true, admin: true
  })

  const setP = (k) => (e) => setProfile(p => ({ ...p, [k]: e.target.value }))

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!profile.name.trim()) { toast.error('Name cannot be empty'); return }
    setLoading(true)
    try {
      const res = await userService.updateProfile(profile)
      updateUser?.({ ...user, ...res.user })
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    setAvatarLoading(true)
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const res = await userService.uploadAvatar(formData)
      updateUser?.({ ...user, avatar: res.avatar })
      toast.success('Profile photo updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload photo')
    } finally {
      setAvatarLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) { toast.error('New passwords do not match'); return }
    if (passwords.new.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await userService.changePassword(passwords.current, passwords.new)
      toast.success('Password changed successfully!')
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const isSchool = user?.educationLevel === 'School'

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account and preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex-1
                ${tab === t.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <motion.form
            onSubmit={handleSaveProfile}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5"
          >
            {/* Avatar Section */}
            <div className="flex items-center gap-5 pb-5 border-b border-slate-100 dark:border-slate-700">
              <div className="relative">
                <Avatar name={user?.name} src={user?.avatar} size="xl" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarLoading}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  <Camera size={13} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{user?.name || 'Your Name'}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{user?.email}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  user?.verificationStatus === 'Verified'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {user?.verificationStatus === 'Verified' ? '✅ Verified' : '⏳ Pending Verification'}
                </span>
              </div>
            </div>

            <Input label="Full Name" value={profile.name} onChange={setP('name')} required />
            <Textarea label="Bio" value={profile.bio} onChange={setP('bio')} placeholder="Tell other students about yourself..." />

            {isSchool ? (
              <>
                <Input label="School Name" value={profile.schoolName} onChange={setP('schoolName')} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select label="Board" value={profile.board} onChange={setP('board')}>
                    <option value="">Select board</option>
                    {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </Select>
                  <Select label="Class" value={profile.className} onChange={setP('className')}>
                    <option value="">Select class</option>
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </div>
              </>
            ) : (
              <>
                <Input label="College / University" value={profile.college} onChange={setP('college')} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select label="Branch" value={profile.branch} onChange={setP('branch')}>
                    <option value="">Select branch</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </Select>
                  <Select label="Semester" value={profile.semester} onChange={setP('semester')}>
                    <option value="">Select semester</option>
                    {SEMESTERS.map(s => <option key={s} value={s}>{s} Semester</option>)}
                  </Select>
                </div>
              </>
            )}

            <Button type="submit" variant="gradient" loading={loading} icon={<Save size={16} />}>
              Save Changes
            </Button>
          </motion.form>
        )}

        {/* Password Tab */}
        {tab === 'password' && (
          <motion.form
            onSubmit={handleChangePassword}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5"
          >
            <Input
              label="Current Password"
              type="password"
              icon={Lock}
              value={passwords.current}
              onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
              required
            />
            <Input
              label="New Password"
              type="password"
              icon={Lock}
              value={passwords.new}
              onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))}
              hint="Minimum 6 characters"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              icon={Lock}
              value={passwords.confirm}
              onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
              required
            />
            <Button type="submit" variant="gradient" loading={loading} icon={<Lock size={16} />}>
              Change Password
            </Button>
          </motion.form>
        )}

        {/* Notifications Tab */}
        {tab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5"
          >
            {[
              { key: 'downloads', label: 'Download Notifications', desc: 'Get notified when someone downloads your notes' },
              { key: 'ratings', label: 'Rating Notifications', desc: 'Get notified when someone rates your notes' },
              { key: 'comments', label: 'Comment Notifications', desc: 'Get notified when someone comments on your notes' },
              { key: 'admin', label: 'Admin Notifications', desc: 'Upload approvals, account updates, and announcements' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                </div>
                <button
                  onClick={() => setNotifSettings(p => ({ ...p, [key]: !p[key] }))}
                  className={`relative w-11 h-6 rounded-full transition-all ${notifSettings[key] ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${notifSettings[key] ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
            <Button
              variant="gradient"
              onClick={() => toast.success('Notification preferences saved!')}
              icon={<Save size={16} />}
            >
              Save Preferences
            </Button>
          </motion.div>
        )}

        {/* Privacy Tab */}
        {tab === 'privacy' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6"
          >
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Account Privacy</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account data and privacy settings</p>
            </div>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                icon={<Shield size={16} />}
                onClick={() => toast.success('Privacy report sent to your email')}
              >
                Download My Data
              </Button>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2"><Trash2 size={16} /> Danger Zone</h4>
                <Button
                  variant="danger"
                  onClick={() => toast.error('Please contact support@campusly.com to delete your account')}
                  icon={<Trash2 size={16} />}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
