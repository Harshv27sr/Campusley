// src/components/home/FeaturesSection.jsx
import { motion } from 'framer-motion'
import { Upload, Search, Brain, Shield, Users, Zap } from 'lucide-react'

const features = [
  {
    icon: Upload,
    title: 'Upload & Share',
    description: 'Drag & drop PDF, DOCX, images. Organize by subject, semester, branch with auto-thumbnail.',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Search,
    title: 'Smart Discovery',
    description: 'Find notes by subject, semester, branch, university. Advanced filters for exactly what you need.',
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: Brain,
    title: 'AI Study Tools',
    description: 'AI summarizer, MCQ generator, important questions extractor, and PDF chat assistant. (Coming Soon)',
    color: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: Shield,
    title: 'Verified Content',
    description: 'Community-rated notes with uploader reputation scores. Report spam, get quality guaranteed.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: Users,
    title: 'Student Community',
    description: 'Connect with students from your college, join study groups, rate and review resources.',
    color: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
  },
  {
    icon: Zap,
    title: 'Reputation System',
    description: 'Earn badges, points, and reputation for every upload and contribution. Top contributors get highlighted.',
    color: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }

export default function FeaturesSection() {
  return (
    <section className="section-padding bg-white dark:bg-slate-900">
      <div className="container-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4 border border-blue-200 dark:border-blue-800">
            ✨ Platform Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white mb-4">
            Everything Students Need,{' '}
            <span className="gradient-text">In One Place</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From note discovery to AI study tools — Campusly is the platform built for modern students.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`${f.bg} rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg mb-5`}>
                <f.icon size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
