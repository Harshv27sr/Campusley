// src/components/home/CTASection.jsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="section-padding bg-white dark:bg-slate-900">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl overflow-hidden text-center px-8 py-16"
        >
          {/* Background effects */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30"
            >
              <BookOpen size={28} className="text-white" />
            </motion.div>

            <h2 className="text-4xl sm:text-5xl font-bold font-display text-white mb-5">
              Ready to Study Smarter?
            </h2>
            <p className="text-blue-100 text-xl max-w-xl mx-auto mb-10">
              Join 10,000+ students on Campusly. Start exploring, uploading, and acing your exams today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn px-8 py-4 rounded-2xl bg-white text-blue-700 font-bold text-base shadow-xl hover:shadow-2xl transition-all"
                >
                  Get Started Free
                  <ArrowRight size={18} className="ml-2" />
                </motion.button>
              </Link>
              <Link to="/explore">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn px-8 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/30 text-white font-bold text-base hover:bg-white/20 transition-all"
                >
                  Explore Notes
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
