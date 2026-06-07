import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-24 border-t border-white/5" style={{ backgroundColor: '#1A1A24' }}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-dark-card border border-dark-border rounded-2xl overflow-hidden text-center px-8 py-16 shadow-2xl"
        >
          {/* Subtle dot pattern */}
          <div className="absolute inset-0 opacity-[0.2]"
            style={{ backgroundImage: 'radial-gradient(circle, var(--color-dark-border) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6"
            >
              <BookOpen size={28} className="text-primary" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
              Ready to Study Smarter?
            </h2>
            <p className="text-dark-muted text-lg max-w-xl mx-auto mb-10">
              Join 10,000+ students on Campusly. Start exploring, uploading, and acing your exams today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-md bg-primary hover:bg-primary-hover text-white font-medium text-sm flex items-center justify-center"
                >
                  Join the Community
                  <ArrowRight size={16} className="ml-2" />
                </motion.button>
              </Link>
              <Link to="/explore">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-md bg-transparent border border-dark-border hover:border-dark-muted text-white font-medium text-sm transition-all"
                >
                  Explore Resources
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}