// src/components/home/TopContributors.jsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Trophy, Upload, Download, Star } from 'lucide-react'
import Avatar from '../ui/Avatar'

const contributors = [
  { id: '1', name: 'Rahul Sharma', branch: 'CSE 6th Sem', uploads: 47, downloads: 12400, rating: 4.9, badge: '🏆', college: 'IIT Delhi' },
  { id: '2', name: 'Priya Singh', branch: 'ECE 5th Sem', uploads: 38, downloads: 9800, rating: 4.8, badge: '⭐', college: 'NIT Trichy' },
  { id: '3', name: 'Amit Gupta', branch: 'AI/ML 4th Sem', uploads: 31, downloads: 8200, rating: 4.7, badge: '🎓', college: 'BITS Pilani' },
  { id: '4', name: 'Sneha Patel', branch: 'IT 5th Sem', uploads: 28, downloads: 7600, rating: 4.8, badge: '💡', college: 'VIT Vellore' },
  { id: '5', name: 'Rohan Kumar', branch: 'CSE 7th Sem', uploads: 24, downloads: 6900, rating: 4.6, badge: '🚀', college: 'DTU Delhi' },
  { id: '6', name: 'Ananya Rao', branch: 'DS 4th Sem', uploads: 22, downloads: 6200, rating: 4.7, badge: '✅', college: 'IIIT Hyderabad' },
]

const rankColors = ['from-yellow-400 to-orange-400', 'from-slate-400 to-slate-500', 'from-amber-600 to-amber-700']

export default function TopContributors() {
  return (
    <section className="section-padding bg-white dark:bg-slate-900">
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
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white mb-3">
            Top <span className="gradient-text">Contributors</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Students who go the extra mile to help their peers
          </p>
        </motion.div>

        {/* Top 3 Podium */}
        <div className="flex flex-col sm:flex-row items-end justify-center gap-4 mb-10">
          {[contributors[1], contributors[0], contributors[2]].map((c, i) => {
            const ranks = [2, 1, 3]
            const rank = ranks[i]
            const heights = ['h-28', 'h-36', 'h-24']
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="text-3xl mb-2">{c.badge}</div>
                <Avatar name={c.name} size="lg" className="mb-2 ring-4 ring-white dark:ring-slate-900" />
                <div className={`text-center bg-gradient-to-b ${rankColors[rank - 1]} rounded-2xl px-6 py-3 ${heights[i]} w-32 flex flex-col items-center justify-center shadow-lg`}>
                  <p className="text-white font-bold text-sm">{c.name.split(' ')[0]}</p>
                  <p className="text-white/80 text-xs">{c.uploads} uploads</p>
                  <div className="mt-1 bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">#{rank}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Rest of contributors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contributors.slice(3).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/profile/${c.id}`}>
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md group">
                  <span className="text-2xl">{c.badge}</span>
                  <Avatar name={c.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate group-hover:text-blue-600 transition-colors">{c.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{c.college}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-xs">
                      <Upload size={11} /> {c.uploads}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 text-xs mt-0.5">
                      <Star size={11} className="fill-yellow-400" /> {c.rating}
                    </div>
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
