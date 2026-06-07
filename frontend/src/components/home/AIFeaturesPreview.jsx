// src/components/home/AIFeaturesPreview.jsx
import { motion } from 'framer-motion'
import { Brain, MessageSquare, FileQuestion, Lightbulb, Sparkles, Lock } from 'lucide-react'

const aiFeatures = [
  { icon: Brain, title: 'AI Note Summarizer', description: 'Upload any PDF and get a crisp summary in seconds. Never read long notes again.', iconColor: 'text-[#3B82F6]', iconBg: 'bg-[#3B82F6]/10', status: 'coming' },
  { icon: MessageSquare, title: 'Chat with PDF', description: 'Ask questions directly to your study materials. Like having a tutor available 24/7.', iconColor: 'text-[#8B5CF6]', iconBg: 'bg-[#8B5CF6]/10', status: 'coming' },
  { icon: FileQuestion, title: 'MCQ Generator', description: 'Generate practice questions from any topic or uploaded notes. Ace your exams.', iconColor: 'text-[#F59E0B]', iconBg: 'bg-[#F59E0B]/10', status: 'coming' },
  { icon: Lightbulb, title: 'Important Questions', description: 'AI predicts likely exam questions based on syllabus patterns and previous year trends.', iconColor: 'text-[#10B981]', iconBg: 'bg-[#10B981]/10', status: 'coming' },
]

export default function AIFeaturesPreview() {
  return (
    <section className="py-24 border-t border-white/5 relative overflow-hidden" style={{ backgroundColor: '#1A1A24' }}>
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#818CF8] text-sm font-semibold mb-5">
            <Sparkles size={14} className="text-[#818CF8]" />
            AI-Powered Features — Coming Soon
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
            Study Smarter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#3B82F6]">AI</span>
          </h2>
          <p className="text-lg text-dark-muted max-w-2xl mx-auto">
            We're building the most intelligent study companion for Indian students.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {aiFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative bg-black/20 border border-white/5 rounded-2xl p-6 overflow-hidden group cursor-pointer hover:border-white/10 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${f.iconBg} flex items-center justify-center mb-5`}>
                <f.icon size={22} className={f.iconColor} />
              </div>

              <h3 className="text-white font-bold mb-2">{f.title}</h3>
              <p className="text-dark-muted text-sm leading-relaxed mb-4">{f.description}</p>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#818CF8]">
                <Lock size={11} />
                Coming Soon
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-dark-muted mb-4 text-sm">Be the first to access AI features when they launch</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 w-full sm:w-auto px-5 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#6366F1]/50 transition-colors"
            />
            <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#6366F1] text-white font-bold text-sm hover:bg-[#4F46E5] transition-all whitespace-nowrap shadow-sm">
              Notify Me
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}