// src/components/home/AIFeaturesPreview.jsx
import { motion } from 'framer-motion'
import { Brain, MessageSquare, FileQuestion, Lightbulb, Sparkles, Lock } from 'lucide-react'

const aiFeatures = [
  { icon: Brain, title: 'AI Note Summarizer', description: 'Upload any PDF and get a crisp summary in seconds. Never read long notes again.', iconColor: 'text-blue-600', iconBg: 'bg-blue-50', status: 'coming' },
  { icon: MessageSquare, title: 'Chat with PDF', description: 'Ask questions directly to your study materials. Like having a tutor available 24/7.', iconColor: 'text-purple-600', iconBg: 'bg-purple-50', status: 'coming' },
  { icon: FileQuestion, title: 'MCQ Generator', description: 'Generate practice questions from any topic or uploaded notes. Ace your exams.', iconColor: 'text-orange-600', iconBg: 'bg-orange-50', status: 'coming' },
  { icon: Lightbulb, title: 'Important Questions', description: 'AI predicts likely exam questions based on syllabus patterns and previous year trends.', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50', status: 'coming' },
]

export default function AIFeaturesPreview() {
  return (
    <section className="section-padding relative overflow-hidden bg-[#F8F9FA] border-y border-gray-200">
      <div className="relative z-10 container-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-[#1A73E8] text-sm font-semibold mb-5">
            <Sparkles size={14} className="text-[#1A73E8]" />
            AI-Powered Features — Coming Soon
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold font-display text-gray-900 mb-4">
            Study Smarter with AI
          </h2>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto">
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
              className="relative bg-white border border-gray-200 rounded-2xl p-6 overflow-hidden group cursor-pointer hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl ${f.iconBg} flex items-center justify-center mb-4`}>
                <f.icon size={22} className={f.iconColor} />
              </div>

              <h3 className="text-gray-900 font-bold mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{f.description}</p>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1A73E8]">
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
          <p className="text-gray-500 mb-4 text-sm">Be the first to access AI features when they launch</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#1A73E8] transition-colors"
            />
            <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1A73E8] text-white font-bold text-sm hover:bg-[#1557B0] transition-all whitespace-nowrap shadow-sm">
              Notify Me
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
