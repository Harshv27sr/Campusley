// src/components/home/TopContributors.jsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Trophy, Upload, Star } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { userService } from '../../services/userService'

const badges = ['🏆', '⭐', '🎓', '💡', '🚀', '✅']
const rankColors = ['from-yellow-400 to-orange-400', 'from-slate-400 to-slate-500', 'from-amber-600 to-amber-700']

export default function TopContributors() {
  const [contributors, setContributors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userService.getTopContributors()
      .then(data => setContributors(Array.isArray(data) ? data : []))
      .catch(() => setContributors([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-gray-900">Top <span className="gradient-text">Contributors</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        </div>
      </section>
    )
  }

  if (contributors.length === 0) return null

  return (
    <section className="section-padding bg-white">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 text-yellow-500 font-semibold text-sm mb-3">
            <Trophy size={16} />
            Leaderboard
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 mb-3">
            Top <span className="gradient-text">Contributors</span>
          </h2>
          <p className="text-gray-500">
            Students who go the extra mile to help their peers
          </p>
        </motion.div>

        {/* Top 3 Podium */}
        {contributors.length >= 3 && (
          <div className="flex flex-col sm:flex-row items-end justify-center gap-4 mb-10">
            {[contributors[1], contributors[0], contributors[2]].map((c, i) => {
              const ranks = [2, 1, 3]
              const rank = ranks[i]
              const heights = ['h-28', 'h-36', 'h-24']
              return (
                <motion.div
                  key={c._id || c.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="text-3xl mb-2">{badges[rank - 1]}</div>
                  <Avatar src={c.avatar} name={c.name} size="lg" className="mb-2 ring-4 ring-white" />
                  <div className={`text-center bg-gradient-to-b ${rankColors[rank - 1]} rounded-2xl px-6 py-3 ${heights[i]} w-32 flex flex-col items-center justify-center shadow-lg`}>
                    <p className="text-white font-bold text-sm">{c.name?.split(' ')[0]}</p>
                    <p className="text-white/80 text-xs">{c.noteCount || 0} uploads</p>
                    <div className="mt-1 bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">#{rank}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Rest of contributors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contributors.slice(3).map((c, i) => (
            <motion.div
              key={c._id || c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/profile/${c._id || c.id}`}>
                <div className="flex items-center gap-4 bg-[#F8F9FA] rounded-2xl p-4 border border-gray-200 hover:border-[#1A73E8]/40 transition-all hover:shadow-md group">
                  <span className="text-2xl">{badges[i + 3] || '🌟'}</span>
                  <Avatar src={c.avatar} name={c.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate group-hover:text-[#1A73E8] transition-colors">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.college || c.schoolName || 'Student'}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Upload size={11} /> {c.noteCount || 0}
                    </div>
                    {c.avgRating > 0 && (
                      <div className="flex items-center gap-1 text-yellow-500 text-xs mt-0.5">
                        <Star size={11} className="fill-yellow-400" /> {c.avgRating}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
