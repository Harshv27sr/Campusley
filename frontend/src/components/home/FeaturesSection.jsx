import { motion } from 'framer-motion'
import { Upload, Search, Brain, ShieldCheck, Users, Award } from 'lucide-react'

const features = [
  {
    icon: Upload,
    title: 'Upload & Share',
    description: 'Drag & drop PDF, DOCX, images. Organize by subject, semester, branch, university with auto-thumbnail.',
    iconColor: 'text-[#3B82F6]',
    iconBg: 'bg-[#3B82F6]/10',
  },
  {
    icon: Search,
    title: 'Smart Discovery',
    description: 'Find notes by subject, semester, branch, university. Advanced filters for exactly what you need.',
    iconColor: 'text-[#F59E0B]',
    iconBg: 'bg-[#F59E0B]/10',
  },
  {
    icon: Brain,
    title: 'AI Study Tools',
    description: 'AI summarizer, MCQ generator, important questions extractor, and PDF chat assistant. (Coming Soon)',
    iconColor: 'text-[#EF4444]',
    iconBg: 'bg-[#EF4444]/10',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Content',
    description: 'Community-rated notes with uploader reputation scores. Report spam, get quality guaranteed.',
    iconColor: 'text-success',
    iconBg: 'bg-success/10',
  },
  {
    icon: Users,
    title: 'Student Community',
    description: 'Connect with students from your college, join study groups, rate and review resources.',
    iconColor: 'text-[#6366F1]',
    iconBg: 'bg-[#6366F1]/10',
  },
  {
    icon: Award,
    title: 'Reputation System',
    description: 'Earn badges, points, and reputation for every upload and contribution. Top contributors get highlighted.',
    iconColor: 'text-warning',
    iconBg: 'bg-warning/10',
  },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }

export default function FeaturesSection() {
  return (
    <section className="py-24 border-t border-white/5" style={{ backgroundColor: '#1A1A24' }}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-medium text-[#6366F1] mb-3">✨ Platform Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
            Everything Students Need, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#3B82F6]">In One Place</span>
          </h2>
          <p className="text-lg text-dark-muted max-w-2xl mx-auto">
            From note discovery to AI study tools — Campusley is the platform built for modern students.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-black/20 rounded-2xl p-8 border border-white/5 transition-all duration-300 hover:border-white/10"
            >
              <div className={`w-12 h-12 rounded-xl ${f.iconBg} flex items-center justify-center mb-6`}>
                <f.icon size={22} className={f.iconColor} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-dark-muted text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}