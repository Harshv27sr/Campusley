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
      <section className="py-24 border-t border-white/5" style={{ backgroundColor: '#1A1A24' }}>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-white">Top <span className="gradient-text gradient-primary">Contributors</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)}
          </div>
        </div>
      </section>
    )
  }

  if (contributors.length === 0) return null

  return (
    <section className="py-24 border-t border-white/5" style={{ backgroundColor: '#1A1A24' }}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
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
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-3">
            Top <span className="gradient-text gradient-primary">Contributors</span>
          </h2>
          <p className="text-dark-muted">
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
                  <Avatar src={c.avatar} name={c.name} size="lg" className="mb-2 ring-4 ring-dark-elevated" />
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
                <div className="flex items-center gap-4 bg-black/20 rounded-2xl p-4 border border-white/5 hover:border-[#6366F1]/40 transition-all hover:bg-black/30 group">
                  <span className="text-2xl">{badges[i + 3] || '🌟'}</span>
                  <Avatar src={c.avatar} name={c.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate group-hover:text-[#818CF8] transition-colors">{c.name}</p>
                    <p className="text-xs text-dark-muted">{c.college || c.schoolName || 'Student'}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-dark-muted text-xs">
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