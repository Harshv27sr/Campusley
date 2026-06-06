// src/components/home/CTASection.jsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-[#F8F9FA] border border-gray-200 rounded-3xl overflow-hidden text-center px-8 py-16"
        >
          {/* Subtle dot pattern */}
          <div className="absolute inset-0 opacity-[0.4]"
            style={{ backgroundImage: 'radial-gradient(circle, #DADCE0 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 bg-[#1A73E8]/10 border border-[#1A73E8]/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <BookOpen size={28} className="text-[#1A73E8]" />
            </motion.div>

            <h2 className="text-4xl sm:text-5xl font-bold font-display text-gray-900 mb-5">
              Ready to Study Smarter?
            </h2>
            <p className="text-gray-500 text-xl max-w-xl mx-auto mb-10">
              Join 10,000+ students on Campusly. Start exploring, uploading, and acing your exams today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn px-8 py-4 rounded-2xl bg-[#1A73E8] text-white font-bold text-base shadow-md hover:bg-[#1557B0] hover:shadow-lg transition-all"
                >
                  Get Started Free
                  <ArrowRight size={18} className="ml-2" />
                </motion.button>
              </Link>
              <Link to="/explore">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn px-8 py-4 rounded-2xl bg-white border border-gray-300 text-gray-700 font-bold text-base hover:border-[#1A73E8] hover:text-[#1A73E8] transition-all shadow-sm"
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
