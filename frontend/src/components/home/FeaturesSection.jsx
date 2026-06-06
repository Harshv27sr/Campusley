// src/components/home/FeaturesSection.jsx
import { motion } from 'framer-motion'
import { Upload, Search, Brain, Shield, Users, Zap } from 'lucide-react'

const features = [
  {
    icon: Upload,
    title: 'Upload & Share',
    description: 'Drag & drop PDF, DOCX, images. Organize by subject, semester, branch with auto-thumbnail.',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
  },
  {
    icon: Search,
    title: 'Smart Discovery',
    description: 'Find notes by subject, semester, branch, university. Advanced filters for exactly what you need.',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
  },
  {
    icon: Brain,
    title: 'AI Study Tools',
    description: 'AI summarizer, MCQ generator, important questions extractor, and PDF chat assistant. (Coming Soon)',
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
  },
  {
    icon: Shield,
    title: 'Verified Content',
    description: 'Community-rated notes with uploader reputation scores. Report spam, get quality guaranteed.',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
  },
  {
    icon: Users,
    title: 'Student Community',
    description: 'Connect with students from your college, join study groups, rate and review resources.',
    iconColor: 'text-cyan-600',
    iconBg: 'bg-cyan-50',
  },
  {
    icon: Zap,
    title: 'Reputation System',
    description: 'Earn badges, points, and reputation for every upload and contribution. Top contributors get highlighted.',
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-50',
  },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }

export default function FeaturesSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#1A73E8] text-sm font-semibold mb-4 border border-blue-100">
            ✨ Platform Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-display text-gray-900 mb-4">
            Everything Students Need,{' '}
            <span className="gradient-text">In One Place</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
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
              className="bg-white rounded-2xl p-6 border border-gray-200 transition-all duration-300 hover:shadow-md hover:border-[#1A73E8]/30"
            >
              <div className={`w-12 h-12 rounded-2xl ${f.iconBg} flex items-center justify-center shadow-sm mb-5`}>
                <f.icon size={22} className={f.iconColor} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
