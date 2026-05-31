// src/pages/UserProfilePage.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, GraduationCap, Upload, Download, Star, BookOpen, Calendar, Edit2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import StatCard from '../components/ui/StatCard'
import NoteGrid from '../components/notes/NoteGrid'
import Button from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/userService'
import { formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function UserProfilePage() {
  const { id } = useParams()
  const { user: authUser } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)

  // If no id in URL → show my own profile
  const isOwnProfile = !id || id === authUser?._id

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        let data
        if (isOwnProfile) {
          data = await userService.getMyProfile()
        } else {
          data = await userService.getUserProfile(id)
        }
        setProfileData(data)
      } catch (err) {
        console.error('Failed to load profile:', err)
        toast.error('Could not load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [id, isOwnProfile])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl h-64" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-slate-200 dark:bg-slate-700 rounded-xl h-24" />)}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!profileData) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-3">🙁</p>
          <p className="font-semibold">Profile not found</p>
        </div>
      </DashboardLayout>
    )
  }

  const { user: profile, uploadCount, totalDownloads, avgRating, notes } = profileData

  const stats = [
    { label: 'Uploads', value: uploadCount || 0, icon: Upload, color: 'blue' },
    { label: 'Downloads', value: totalDownloads >= 1000 ? `${(totalDownloads / 1000).toFixed(1)}K` : totalDownloads || 0, icon: Download, color: 'green' },
    { label: 'Avg Rating', value: avgRating || '—', icon: Star, color: 'yellow' },
    { label: 'Reputation', value: (uploadCount || 0) * 60 + (totalDownloads || 0), icon: BookOpen, color: 'purple' },
  ]

  const badges = []
  if (profile.verificationStatus === 'Verified') badges.push('✅ Verified Uploader')
  if ((uploadCount || 0) >= 10) badges.push('🏆 Top Contributor')
  if (profile.role === 'admin') badges.push('🛡️ Admin')
  if ((avgRating || 0) >= 4.5) badges.push('⭐ High Rated')
  if (badges.length === 0) badges.push('🎓 Student')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          {/* Cover */}
          <div className="h-32 sm:h-48 bg-gradient-to-br from-blue-600 to-purple-700 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-16 mb-4 gap-4">
              <Avatar
                name={profile.name}
                size="2xl"
                className="ring-4 ring-white dark:ring-slate-800"
              />
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <Link to="/settings">
                    <Button variant="outline" size="sm" icon={<Edit2 size={14} />}>Edit Profile</Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" disabled className="opacity-50 cursor-not-allowed">Follow (Soon)</Button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">{profile.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{profile.email}</p>
            </div>

            {profile.bio && (
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 max-w-2xl">{profile.bio}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-5">
              {profile.educationLevel === 'School' ? (
                <>
                  <span className="flex items-center gap-1.5"><GraduationCap size={15} /> {profile.schoolName || 'School Student'}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={15} /> {profile.board} • {profile.className}</span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5"><GraduationCap size={15} /> {profile.college || 'College Student'}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={15} /> {profile.branch} • Sem {profile.semester}</span>
                </>
              )}
              {profile.createdAt && (
                <span className="flex items-center gap-1.5"><Calendar size={15} /> Joined {formatDate(profile.createdAt)}</span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {badges.map(badge => (
                <span key={badge} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        {/* Uploaded Notes */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">
            Uploaded Notes ({notes?.length || 0})
          </h2>
          <NoteGrid
            notes={notes || []}
            loading={false}
            emptyTitle="No uploads yet"
            emptyDesc="This user hasn't uploaded any notes yet."
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
