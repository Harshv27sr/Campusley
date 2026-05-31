// src/components/home/AIFeaturesPreview.jsx
import { motion } from 'framer-motion'
import { Brain, MessageSquare, FileQuestion, Lightbulb, Sparkles, Lock } from 'lucide-react'

const aiFeatures = [
  { icon: Brain, title: 'AI Note Summarizer', description: 'Upload any PDF and get a crisp summary in seconds. Never read long notes again.', color: 'from-blue-500 to-cyan-400', status: 'coming' },
  { icon: MessageSquare, title: 'Chat with PDF', description: 'Ask questions directly to your study materials. Like having a tutor available 24/7.', color: 'from-purple-500 to-pink-500', status: 'coming' },
  { icon: FileQuestion, title: 'MCQ Generator', description: 'Generate practice questions from any topic or uploaded notes. Ace your exams.', color: 'from-orange-500 to-red-400', status: 'coming' },
  { icon: Lightbulb, title: 'Important Questions', description: 'AI predicts likely exam questions based on syllabus patterns and previous year trends.', color: 'from-emerald-500 to-teal-400', status: 'coming' },
]

export default function AIFeaturesPreview() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-blue-900" />
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />
      <div className="absolute top-0 -right-48 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -left-48 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-3xl" />

      <div className="relative z-10 container-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-semibold mb-5">
            <Sparkles size={14} className="text-yellow-300" />
            AI-Powered Features — Coming Soon
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold font-display text-white mb-4">
            Study Smarter with AI
          </h2>
          <p className="text-blue-200 text-xl max-w-2xl mx-auto">
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
              className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 overflow-hidden group cursor-pointer"
            >
              {/* Blur overlay */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg mb-4`}>
                <f.icon size={22} className="text-white" />
              </div>

              <h3 className="text-white font-bold mb-2">{f.title}</h3>
              <p className="text-blue-200 text-sm leading-relaxed mb-4">{f.description}</p>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-yellow-300">
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
          <p className="text-blue-200 mb-4 text-sm">Be the first to access AI features when they launch</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-blue-300 text-sm focus:outline-none focus:border-white/50 backdrop-blur"
            />
            <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-all whitespace-nowrap">
              Notify Me
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
